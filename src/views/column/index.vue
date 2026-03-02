<template>
  <div class="column-wrap">
    <div class="col-wrap">
      <div class="col-wrap-inner">
        <el-button type="primary" @click="add">新增</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <TableComp :width="'100%'" :border="true" :data="list" :colConfigs="colConfigs">
      <template #status="{scope}">
        <el-switch
          v-model="scope.row.status"
          active-text="开启"
          inactive-text="关闭"
          :active-value="1"
          :inactive-value="0"
          @change="handleSwitchChange(scope.row)">
        </el-switch>
      </template>
      <template #opt="{scope}">
        <el-button key="primary" link type="primary" @click="edit(scope.row)">编辑</el-button>
        <el-popconfirm title="确定要删除该配置吗？" @confirm="del(scope.row.id)">
          <template #reference>
            <el-button key="danger" link type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </TableComp>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="360px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
    >
      <el-form ref="ruleFormRef" :model="form" :rules="rules" :label-position="labelPosition" label-width="80">
        <el-form-item label="专栏名称" prop="columnName">
          <el-input v-model="form.columnName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import TableComp from '@/components/common/TableComp.vue';
import midApi from '@/apis/mid';
import type { colConfigType } from '#types/TableType';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { isMobile } from '@/utils/commonUtils';

const list = ref([]);
const colConfigs = ref<Array<colConfigType>>([
  {
    prop: 'id',
    label: 'id',
    width: '120',
  },
  {
    prop: 'columnName',
    label: '专栏名',
  },
  {
    prop: 'status',
    label: '状态',
    slot: 'status',
    width: '200',
  },
  {
    prop: 'opt',
    label: '操作',
    slot: 'opt',
    width: '120',
  },
]);
const getList = async () => {
  const data = await midApi.getAllColumn();
  list.value = data;
};
onMounted(() => {
  getList();
});

const labelPosition = computed(() => {
	return isMobile() === true ? 'top' : 'right';
});
const ruleFormRef = ref<FormInstance>();
const form = reactive({
  id: null,
  columnName: ''
});
const rules = reactive<FormRules>({
  columnName: [{ required: true, message: '请输入专栏名称', trigger: 'blur' }]
});
const dialogTitle = ref('');
const dialogVisible = ref(false);
const add = () => {
  dialogTitle.value = '新增专栏';
  dialogVisible.value = true;
};
const edit = (row: any) => {
  form.id = row.id;
  form.columnName = row.columnName;
  dialogTitle.value = '编辑专栏';
  dialogVisible.value = true;
};

const del = async (id: number) => {
  let result = await midApi.delColumn(id);
  if (result) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    });
    getList();
  }
};
const handleSwitchChange = async (row: any) => {
  if (!row.id) return;
  row.status === 0 ? row.status = 1 : row.status = 0;
  let result = await midApi.updateColumnStatus({
    id: row.id,
    status: row.status === 0 ? 1 : 0
  });
  if (result) {
    ElMessage({
      message: '操作成功',
      type: 'success',
    });
    getList();
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (dialogTitle.value === '新增专栏') {
        const data = await midApi.addColumn({ ...form });
        if (data) {
          ElMessage({
            message: '新增成功',
            type: 'success',
          });
        }
      } else {
        const data = await midApi.updateColumn({ ...form });
        if (data) {
          ElMessage({
            message: '更新成功',
            type: 'success',
          });
        }
      }
      handleClose(formEl);
      getList();
    } else {
      console.log('error submit!', fields);
    }
  });
};
const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  form.columnName = '';
};
</script>

<style lang="less" scoped>
.column-wrap {
  padding: 10px;
}
.col-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
}
</style>