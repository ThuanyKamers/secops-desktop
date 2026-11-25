import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base './' makes the build work on GitHub Pages under any repository name
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'node' },
})
