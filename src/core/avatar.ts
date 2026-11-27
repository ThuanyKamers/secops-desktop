/** Largest photo the player can pick; it is resized before upload, so this only guards the browser. */
export const MAX_INPUT_BYTES = 5 * 1024 * 1024
/** Same limit the Supabase bucket enforces (supabase/migrations/0002_avatars.sql). */
export const MAX_UPLOAD_BYTES = 200 * 1024
export const AVATAR_SIZE = 256

export type AvatarError = 'type' | 'tooBig' | 'unreadable'

export function checkAvatarFile(file: { type: string; size: number }): AvatarError | null {
  if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) return 'type'
  if (file.size > MAX_INPUT_BYTES) return 'tooBig'
  return null
}

/** Center-crops the image to a square and resizes it to 256x256 WebP (usually 10-30 KB). */
export async function resizeAvatar(file: File): Promise<Blob> {
  let bmp: ImageBitmap
  try {
    bmp = await createImageBitmap(file)
  } catch {
    throw new Error('unreadable')
  }
  const side = Math.min(bmp.width, bmp.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = AVATAR_SIZE
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE)
  bmp.close()
  for (const q of [0.85, 0.7, 0.5]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', q))
    if (blob && blob.size <= MAX_UPLOAD_BYTES) return blob
  }
  throw new Error('tooBig')
}
