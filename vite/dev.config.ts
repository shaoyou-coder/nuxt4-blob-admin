import { viteMockServe } from 'vite-plugin-mock';
import { join } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export default function (command: 'build' | 'serve', mode: string) {
  const envPath = join(__dirname, `../env/.env.${mode}`);
  const env = dotenv.parse(readFileSync(envPath));
  return {
    plugins: [
      viteMockServe({
        mockPath: "mock",
        enable: command === 'serve'
      }),
    ],
    server: {
      hmr: {
        // 启用热更新
        overlay: true, // 显示错误覆盖层
      },
      // 确保文件监听正确配置
      watch: {
        usePolling: true, // 在某些环境下需要轮询
        interval: 100
      },
      host: '0.0.0.0',
      port: 8080,
      proxy: { // api接口请求代理
        '/mid/mockApi': {
          target: env.WD_PROXY_SERVER_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/mid\/mockApi/, '/mockApi')
        },
        '/mid': {
          target: env.WD_PROXY_SERVER_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/mid/, '/mid')
        }
      }
    }
  };
}