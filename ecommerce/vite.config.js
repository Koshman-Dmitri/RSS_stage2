import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    checker({ typescript: true, eslint: { lintCommand: 'eslint ./src' } }),
    nodePolyfills(),
  ],
  build: {
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    testTimeout: 10000,
  },
});
