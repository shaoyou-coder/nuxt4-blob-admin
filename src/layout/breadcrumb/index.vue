<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in tabs" :key="item.path" :to="item.path">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationMatched } from 'vue-router';
const route = useRoute();
const tabs: Ref<RouteLocationMatched[]> = ref([]);
const getBreadCom = () => {
  let mached = route.matched.filter(item => item.meta.title);
  tabs.value = mached;
};
getBreadCom();
// 监听路径的改变,如果发生变化了，执行方法
watch(() => route.path, () => getBreadCom());
</script>

<style scoped>
.breadcrumb {
  width: 100%;
  height: 40px;
  padding-left: 10px;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.el-breadcrumb {
  height: 100%;
  line-height: 40px !important;
}
</style>