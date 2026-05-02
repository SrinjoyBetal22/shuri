import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'Shūri',
        short_name: 'Shūri',
        description: 'A minimal productivity management app',
        theme_color: '#1A1A1A',
        background_color: '#1A1A1A',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Shūri Desktop View'
          },
          {
            src: 'screenshot-narrow.png',
            sizes: '375x667',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Shūri Mobile View'
          }
        ]
      }
    })
  ],
})
