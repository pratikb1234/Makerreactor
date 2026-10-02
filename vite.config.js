import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(), 
    tailwindcss(),
    legacy({
      targets: ['defaults', 'not IE 11', 'iOS >= 11', 'Safari >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
