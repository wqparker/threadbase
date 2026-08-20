import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              // icons rely on the viewBox to scale when width/height are
              // overridden via props — svgo's default preset strips it
              params: { overrides: { removeViewBox: false } },
            },
          ],
        },
        // Illustrator bakes literal black into the export; swap it for
        // currentColor so icons pick up the light/dark theme automatically
        replaceAttrValues: { '#000': 'currentColor', '#000000': 'currentColor' },
        // match the sizing/accessibility defaults the hand-written icons use
        svgProps: { width: '20', height: '20', 'aria-hidden': 'true' },
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    globals: true,
  },
})
