import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Don't change this unless you're deploying under a subfolder
  plugins: [react()],
});
