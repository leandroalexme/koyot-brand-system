import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      define: {
        // Generic fallback for GEMINI API key (unused with backend proxy)
        'process.env.API_KEY' : JSON.stringify('api-key-this-is-not-used-can-be-ignored!'),
      },
      server: {
        proxy: {
          // Target your Node.js backend
          '/api-proxy': 'http://127.0.0.1:5000',
          '/ws-proxy': { target: 'ws://127.0.0.1:5000', ws: true },
          '/r': 'http://127.0.0.1:5000',
        },
      },
      optimizeDeps: {
        include: [
          '@base-ui/react/accordion',
          '@base-ui/react/alert-dialog',
          '@base-ui/react/combobox',
          '@base-ui/react/collapsible',
          '@base-ui/react/dialog',
          '@base-ui/react/drawer',
          '@base-ui/react/input',
          '@base-ui/react/menu',
          '@base-ui/react/merge-props',
          '@base-ui/react/meter',
          '@base-ui/react/otp-field',
          '@base-ui/react/popover',
          '@base-ui/react/progress',
          '@base-ui/react/radio',
          '@base-ui/react/scroll-area',
          '@base-ui/react/select',
          '@base-ui/react/separator',
          '@base-ui/react/slider',
          '@base-ui/react/switch',
          '@base-ui/react/tabs',
          '@base-ui/react/toggle',
          '@base-ui/react/toggle-group',
          '@base-ui/react/toolbar',
          '@base-ui/react/tooltip',
          '@base-ui/react/use-render',
          'lucide-react',
          '@carbon/icons-react',
        ],
      },
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(import.meta.dirname, '.'),
        }
      }
    };
});
