<template>
  <!-- 封装表格组件 -->
  <div class="table" :style="{ width: width }">
    <el-table ref="tableRef" v-bind="$attrs" :data="data" :header-cell-style="tableHeaderStyle" :max-height="tableHeight">
      <template v-for="colConfig in colConfigs" :key="colConfig.prop">
        <el-table-column v-if="colConfig.slot" :width="colConfig.width" :align="colConfig.align || 'center'" :label="colConfig.label">
          <template #default="scope">
            <slot :name="colConfig.slot" :scope="scope"></slot>
          </template>
        </el-table-column>
        <el-table-column v-if="!colConfig.slot" :align="colConfig.align || 'center'" :prop="colConfig.prop"
          :label="colConfig.label" :width="colConfig.width">
          <template v-if="colConfig.isImg" #default="scope">
            <PreviewImg :img="scope.row[colConfig.prop]"></PreviewImg>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-scrollbar direction="horizontal"></el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import PreviewImg from './PreviewImg.vue';
import { useTableHeight } from '@/composables/table';

// 列属性类型，可增加
type colConfigType = {
  width?: string | number,                         // 列宽度
  align?: string,                                  // 对齐方式
  slot?: string,                                   // 是否使用插槽
  isImg?: boolean,                                 // 是否是图片资源
  prop: string,                                    // 字段名称
  label: string,                                   // 字段标题
}
// 表头属性类型，可增加
type TablePropsType = {
  width: string,                                  // 表格宽度
  colConfigs: Array<colConfigType>,               // 表头
  data: Array<object>,                            // 表格数据
}

// props数据设置响应式
const props = defineProps<TablePropsType>();
const { colConfigs, data } = toRefs(props);

// 设置表头样式
const tableHeaderStyle = () => {
  return {
    backgroundColor: '#E7E7E7',
    color: '#333333',
    fontWeight: 'bold'
  };
};

// 设置表格的最大高度
const tableRef = ref(null);
const tableHeight = ref<number | undefined>(0);
const { setTableHeight } = useTableHeight();
onMounted(() => {
  tableHeight.value = setTableHeight(tableRef);
});

</script>

<style scoped></style>