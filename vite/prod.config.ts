export default {
  base: '/',
  build: {
    outDir: 'dist',
    reportCompressedSize: false,
    minify: true, // 是否开启压缩，可设置false关闭或者使用'esbuild'开启
    sourcemap: false,
    manifest: false
  }
};