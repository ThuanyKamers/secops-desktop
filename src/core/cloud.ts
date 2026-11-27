import type { SupabaseClient } from '@supabase/supabase-js'
import { create } from 'zustand'
import { useGame } from './store'
import { earnedBadges } from './progress'
import { MISSIONS } from '../content'
import { checkAvatarFile, resizeAvatar } from './avatar'

// Public by design: the publishable key ships with every Supabase web app.
// What protects player data is Row Level Security, see supabase/migrations.
const SUPABASE_URL = 'https://secdwzevrkspozkaehgt.supabase.co'
const SUPABASE_KEY = 'sb_publishable_xnUD89cIsZfcHSJIRkhmtw_LRlHEzfY'

export const USERNAME_RE = /^[a-z0-9_]{3,20}$/

export interface CloudProfile {
  username: string
  display_name: string | null
  avatar_url: string | null
}

export interface RankRow {
  rank: number
  username: string
  display_name: string | null
  avatar_url: string | null
  xp: number
  missions: number
  badges: number
}

type Status = 'loading' | 'signedOut' | 'signedIn'

interface AccountState {
  status: Status
  userId: string | null
  profile: CloudProfile | null
  syncing: boolean
  error: string | null
  emailSent: boolean
}

export const useAccount = create<AccountState>(() => ({
  status: 'loading',
  userId: null,
  profile: null,
  syncing: false,
  error: null,
  emailSent: false,
}))

let clientPromise: Promise<SupabaseClient> | null = null

function client(): Promise<SupabaseClient> {
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true } }),
  )
  return clientPromise
}

function redirectUrl() {
  return window.location.origin + window.location.pathname
}

function fail(e: unknown) {
  const msg = e instanceof Error ? e.message : typeof e === 'object' && e && 'message' in e ? String((e as { message: unknown }).message) : String(e)
  useAccount.setState({ error: msg, syncing: false })
}

async function loadProfile(userId: string) {
  const sb = await client()
  const { data, error } = await sb.from('profiles').select('username, display_name, avatar_url').eq('id', userId).single()
  if (error) return fail(error)
  useAccount.setState({ profile: data })
  if (data.display_name && !useGame.getState().playerName) useGame.getState().setPlayerName(data.display_name)
}

/** Uploads every local attempt and badge not yet on the server. Safe to call repeatedly. */
export async function syncProgress() {
  const { userId } = useAccount.getState()
  if (!userId) return
  const history = useGame.getState().history
  if (history.length === 0) return
  useAccount.setState({ syncing: true, error: null })
  try {
    const sb = await client()
    const rows = history.map((a) => ({
      client_id: a.id,
      mission_id: a.missionId,
      score: a.score,
      max_score: a.max,
      pct: a.pct,
      duration_sec: a.durationSec,
      lang: a.lang,
      os: a.os,
      played_at: a.at,
    }))
    const r1 = await sb.from('attempts').upsert(rows, { onConflict: 'user_id,client_id', ignoreDuplicates: true })
    if (r1.error) throw r1.error
    const badges = earnedBadges(history, MISSIONS).map((badge_id) => ({ badge_id }))
    if (badges.length) {
      const r2 = await sb.from('user_badges').upsert(badges, { onConflict: 'user_id,badge_id', ignoreDuplicates: true })
      if (r2.error) throw r2.error
    }
    useAccount.setState({ syncing: false })
  } catch (e) {
    fail(e)
  }
}

let started = false
/** Restores the session (also after the OAuth / email link redirect) and keeps progress in sync. */
export function startCloud() {
  if (started) return
  started = true
  // a failed sign-in comes back as ?error_description=... (or in the hash)
  const params = new URLSearchParams(window.location.search + '&' + window.location.hash.slice(1))
  const authError = params.get('error_description')
  if (authError) {
    useAccount.setState({ error: authError })
    window.history.replaceState(null, '', window.location.pathname)
  }
  client()
    .then((sb) => {
      sb.auth.onAuthStateChange((_event, session) => {
        const id = session?.user.id ?? null
        const was = useAccount.getState().userId
        useAccount.setState({ status: id ? 'signedIn' : 'signedOut', userId: id })
        if (id && id !== was) {
          // defer: Supabase recommends not awaiting other calls inside this callback
          setTimeout(() => { void loadProfile(id); void syncProgress() }, 0)
        }
        if (!id) useAccount.setState({ profile: null })
      })
    })
    .catch(fail)
  // upload each new attempt as soon as it is submitted
  let last = useGame.getState().history.length
  useGame.subscribe((s) => {
    if (s.history.length !== last) {
      last = s.history.length
      void syncProgress()
    }
  })
}

export async function signInWithGitHub() {
  try {
    const sb = await client()
    const { error } = await sb.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: redirectUrl() } })
    if (error) throw error
  } catch (e) {
    fail(e)
  }
}

export async function signInWithEmail(email: string) {
  useAccount.setState({ error: null, emailSent: false })
  try {
    const sb = await client()
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectUrl() } })
    if (error) throw error
    useAccount.setState({ emailSent: true })
  } catch (e) {
    fail(e)
  }
}

export async function signOut() {
  const sb = await client()
  await sb.auth.signOut()
}

export async function updateProfile(patch: Partial<CloudProfile>): Promise<boolean> {
  const { userId } = useAccount.getState()
  if (!userId) return false
  useAccount.setState({ error: null })
  const sb = await client()
  const { data, error } = await sb.from('profiles').update(patch).eq('id', userId).select('username, display_name, avatar_url').single()
  if (error) {
    fail(error.code === '23505' ? 'username_taken' : error)
    return false
  }
  useAccount.setState({ profile: data })
  return true
}

export async function deleteAccount() {
  try {
    const sb = await client()
    // Storage files are not removed by the database cascade, so delete the photo first
    const uid = useAccount.getState().userId
    if (uid) await sb.storage.from('avatars').remove([`${uid}/avatar.webp`])
    const { error } = await sb.rpc('delete_my_account')
    if (error) throw error
    await sb.auth.signOut()
  } catch (e) {
    fail(e)
  }
}

export async function fetchLeaderboard(): Promise<RankRow[]> {
  const sb = await client()
  const { data, error } = await sb.rpc('leaderboard', { max_rows: 50 })
  if (error) throw error
  return (data ?? []) as RankRow[]
}

/** Resizes the picked image in the browser and stores it as avatars/<uid>/avatar.webp. */
export async function uploadAvatar(file: File): Promise<boolean> {
  const { userId } = useAccount.getState()
  if (!userId) return false
  const bad = checkAvatarFile(file)
  if (bad) {
    fail(`avatar_${bad}`)
    return false
  }
  useAccount.setState({ error: null })
  try {
    const blob = await resizeAvatar(file)
    const sb = await client()
    const path = `${userId}/avatar.webp`
    const up = await sb.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/webp', cacheControl: '3600' })
    if (up.error) throw up.error
    const url = sb.storage.from('avatars').getPublicUrl(path).data.publicUrl
    // version suffix so browsers show the new photo instead of a cached one
    return await updateProfile({ avatar_url: `${url}?v=${Date.now()}` })
  } catch (e) {
    const msg = e instanceof Error ? e.message : ''
    fail(msg === 'tooBig' || msg === 'unreadable' ? `avatar_${msg}` : e)
    return false
  }
}

export async function removeAvatar(): Promise<boolean> {
  const { userId } = useAccount.getState()
  if (!userId) return false
  try {
    const sb = await client()
    await sb.storage.from('avatars').remove([`${userId}/avatar.webp`])
    return await updateProfile({ avatar_url: null })
  } catch (e) {
    fail(e)
    return false
  }
}
