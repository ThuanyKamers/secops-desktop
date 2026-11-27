import { describe, expect, it } from 'vitest'
import { MAX_INPUT_BYTES, checkAvatarFile } from '../core/avatar'

describe('avatar file check', () => {
  it('accepts common image types under the limit', () => {
    expect(checkAvatarFile({ type: 'image/png', size: 1000 })).toBeNull()
    expect(checkAvatarFile({ type: 'image/jpeg', size: MAX_INPUT_BYTES })).toBeNull()
  })
  it('rejects other file types (SVG can carry scripts)', () => {
    expect(checkAvatarFile({ type: 'image/svg+xml', size: 1000 })).toBe('type')
    expect(checkAvatarFile({ type: 'application/pdf', size: 1000 })).toBe('type')
  })
  it('rejects files over 5 MB', () => {
    expect(checkAvatarFile({ type: 'image/png', size: MAX_INPUT_BYTES + 1 })).toBe('tooBig')
  })
})
