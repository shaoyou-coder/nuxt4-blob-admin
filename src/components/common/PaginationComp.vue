<template>
  <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
    :small="false" :background="true" layout="total, sizes, prev, pager, next, jumper" :total="total"
    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
</template>

<script setup lang="ts">
const props = defineProps<{
  total: number
}>();
const {total} = toRefs(props);

type EmitsType = {
  (e: 'handleSizeChange', val: number): void,
  (e: 'handleCurrentChange', val: number): void,
}
const emits = defineEmits<EmitsType>();

const currentPage = ref(1);
const pageSize = ref(10);

const handleSizeChange = (val: number) => {
  emits('handleSizeChange', val);
};

const handleCurrentChange = (val: number) => {
  emits('handleCurrentChange', val);
};
</script>

<style scoped>
  .el-pagination {
    white-space: unset;
  }
</style>