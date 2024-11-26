import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    proxy: {
            '/api': {
              target: 'http://192.168.139.5:6969', // Your backend server
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''), // Strips '/api' prefix if used
            },
          },
  },
  plugins: [react()],
  define: {
    global: {},
  },
});



// vite.config.ts or vite.config.js
// export default {
//   server: {
//    
//   },
// };
