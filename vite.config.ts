import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/GymFittrack/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['dumbbell.svg'],
      manifest: {
        id: '/GymFittrack/',
        name: 'GymFittrack',
        short_name: 'GymFittrack',
        description: 'متابعة تماريني وقياساتي 🏋️‍♀️',
        lang: 'ar',
        dir: 'rtl',
        start_url: '/GymFittrack/',
        scope: '/GymFittrack/',
        display: 'standalone',
        background_color: '#F3F3FE',
        theme_color: '#8B8BF5',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
    }),
  ],
})
