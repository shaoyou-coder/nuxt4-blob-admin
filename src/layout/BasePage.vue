<template>
  <div class="common-layout">
    <el-container>
      <el-header height="45px">
        <TopBar></TopBar>
      </el-header>
      <el-container>
        <el-aside :width="userStore.sideWidth">
          <SideBar></SideBar>
        </el-aside>
        <el-main>
          <Breadcrumb></Breadcrumb>
          <div class="content-warp">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import TopBar from "./navmenu/TopBar.vue";
import SideBar from "./navmenu/SideBar.vue";
import Breadcrumb from "./breadcrumb/index.vue";
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
</script>

<style scoped>
.el-header {
  padding: 0;
}
.el-aside {
  max-width: 140px !important;
}
.el-main {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 45px);
  background-color: var(--content-bg, #FFF);
  padding: 0px;
}
.el-main .content-warp {
  flex: 1;
  background-color: var(--content-bg, #FFF);
}
</style>