import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

// 引入elementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// 引入v-viewer
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

// 设置标题
import config from '@config';
document.title = config.projectTitle;

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(VueViewer);

// 初始化主题
import { useThemeStore } from '@/stores/theme';
const themeStore = useThemeStore();
themeStore.initTheme();

app.mount('#app');
