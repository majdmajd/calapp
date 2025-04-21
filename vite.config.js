import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qrcode } from 'vite-plugin-qrcode';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    qrcode(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Calisthenitics App',
        short_name: 'CalApp',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#1e90ff',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0', // allows phone access via IP
    port: 5173,
  },
});
