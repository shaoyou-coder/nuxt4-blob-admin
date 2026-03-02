import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import eslintPlugin from 'vite-plugin-eslint';
import AutoImport from 'unplugin-auto-import/vite';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default {
  envDir: resolve(__dirname, '../env/'),
  envPrefix: 'WD_',
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: false, // 因为vite对于现代浏览器只会使用esbuild做代码转换降级处理，关于polyfill默认是没有的，需要有的话，将此设为true即可
    }),
    eslintPlugin({
      include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue']
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      exclude: ['/public/', /[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
      imports: ['vue', 'vue-router', 'pinia'],
      eslintrc: {
        enabled: true,
      },
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': pathResolve('src') + '/',
      '#types': pathResolve('types') + '/',
      '@config': pathResolve('src/config/index.ts'),
    }
  },
};