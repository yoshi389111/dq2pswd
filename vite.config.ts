/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dq2pswd/',
  test: {
    globals: true,
  },
  build: {
    outDir: 'docs',
  },
});
