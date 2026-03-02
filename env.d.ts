/// <reference types="vite/client" />

// 解决main.ts中引入elementPlus中文样式的报错：找不到模块；
declare module 'element-plus/dist/locale/zh-cn.mjs';
declare module 'ali-oss';
declare module 'js-md5';

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
