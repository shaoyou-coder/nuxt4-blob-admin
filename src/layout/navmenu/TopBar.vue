<template>
  <div class="top-bar">
    <div class="top-left">
      <div v-show="!isCollapse" class="logo-container">
        博客管理系统
      </div>
      <div class="collapse" style="padding-top: 7px;">
        <el-icon size="23" @click="handleCol">
          <Fold v-show="!isCollapse" />
          <Expand v-show="isCollapse" />
        </el-icon>
      </div>
    </div>
    <div class="top-right">
      <el-icon class="theme-toggle" size="20" @click="toggleTheme">
        <Sunny v-if="themeStore.theme === 'dark'" />
        <Moon v-else />
      </el-icon>
      <el-button class="exit-btn" type="danger" size="small" @click="logOff">注销</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Fold,
  Expand,
  Sunny,
  Moon
} from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
const userStore = useUserStore();
const themeStore = useThemeStore();
const { isCollapse, sideWidth } = storeToRefs(useUserStore());
const router = useRouter();

const handleCol = () => {
  isCollapse.value = !isCollapse.value;
  if (isCollapse.value) { // 收起
    sideWidth.value = '0px';
  } else {
    sideWidth.value = '140px';
  }
};

const logOff = () => {
  userStore.loginOut();
  router.replace('/login');
};

const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid var(--border-color, #dcdfe6);
  background-color: var(--bg-color, #fff);
}

.top-bar .top-left {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.top-bar .top-left .logo-container {
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    margin: 0 10px;
}

.top-bar .top-left .logo-container .logo {
  height: 44px;
  margin: 0 auto;
}

.top-bar .top-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.top-bar .top-right .theme-toggle {
  cursor: pointer;
  color: var(--el-text-color-primary);
  transition: color 0.3s;
}

.top-bar .top-right .theme-toggle:hover {
  color: var(--el-color-primary);
}

.top-bar .top-right .exit-btn {
  margin-right: 30px;
}
</style>