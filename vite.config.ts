import { defineConfig } from 'vite';
import { mergeObj } from './src/utils/commonUtils';
import baseConfig from './vite/base.config';
import devConfig from './vite/dev.config';
import prodConfig from './vite/prod.config';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const { command, mode } = config;
  if (command === 'serve') {
    return mergeObj(baseConfig, devConfig(command, mode));
  } else {
    return mergeObj(baseConfig, prodConfig);
  }
});
