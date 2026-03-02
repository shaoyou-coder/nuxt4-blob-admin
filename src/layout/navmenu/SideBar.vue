<template>
  <div class="side-bar">
    <el-menu :default-active="userStore.routeActiveIndex" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
      <template v-for="(item, index) in menuList" :key="item.path">
        <template v-if="item.children">
          <el-sub-menu index="1-4">
            <template #title><span>{{ item.meta?.title }}</span></template>
            <el-menu-item v-for="(subItem, subIndex) in item.children" :index="`${index + 1}-${subIndex + 1}`"
              :key="subItem.path" @click="handleGoPath(subItem, index + 1, subIndex + 1)">
              {{ subItem.meta?.title }}
            </el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="`${index + 1}-1`" @click="handleGoPath(item, index + 1, 1)">{{ item.meta?.title
          }}</el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const router = useRouter();
const menuList = router.options.routes[0].children;
const handleGoPath = (routeInfo: RouteRecordRaw, index: number, subIndex?: number) => {
  router.push(routeInfo.path);
  // 存储当前激活菜单的index
  userStore.routeActiveIndex = `${index}-${subIndex}`;
};

</script>

<style scoped>
.side-bar {
  overflow: hidden;
  height: 100%;
  border-right: solid 1px var(--el-menu-border-color);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  height: 100%;
}

.el-menu {
  border-right: none;
}

.collapse {
  display: flex;
  justify-content: flex-end;
}
</style>