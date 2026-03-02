<template>
  <div class="column-wrap">
    <div class="col-wrap">
      <div class="col-wrap-inner">
        <el-button type="primary" @click="add">新增</el-button>
        <div class="search-item">
          <p>专栏：</p>
          <el-select v-model="search.columnId" clearable @change="handleSearch">
            <el-option v-for="item in columnList" :key="item.id" :label="item.columnName" :value="item.id"></el-option>
          </el-select>
        </div>
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
      <el-form ref="ruleFormRef" :model="form" :rules="rules" :label-position="labelPosition" label-width="120">
        <el-form-item label="文章类型名称" prop="typeName">
          <el-input v-model="form.typeName" />
        </el-form-item>
        <el-form-item label="所属专栏" prop="columnId">
          <el-select v-model="form.columnId">
            <el-option v-for="item in columnList" :key="item.id" :label="item.columnName" :value="item.id"></el-option>
          </el-select>
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
const columnList = ref<Array<{
  id: number,
  columnName: string
}>>([]);
const search = reactive({
  columnId: ''
});
const colConfigs = ref<Array<colConfigType>>([
  {
    prop: 'id',
    label: 'id',
    width: '120',
  },
  {
    prop: 'typeName',
    label: '文章类型名称',
  },
  {
    prop: 'columnName',
    label: '所属专栏',
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
const getColumnList = async () => {
  const data = await midApi.getAllColumn();
  columnList.value = data;
};
const getList = async () => {
  const data = await midApi.getAllArticleType();
  list.value = data;
};
const handleSearch = async () => {
  const data = await midApi.getArticleTypeByCol({ ...search });
  list.value = data;
};
const handleSwitchChange = async (row: any) => {
  if (!row.id) return;
  row.status === 0 ? row.status = 1 : row.status = 0;
  let result = await midApi.updateArticleTypeStatus({
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
onMounted(() => {
  getList();
  getColumnList();
});

const labelPosition = computed(() => {
	return isMobile() === true ? 'top' : 'right';
});
const ruleFormRef = ref<FormInstance>();
const form = reactive({
  id: null,
  typeName: '',
  columnId: ''
});
const rules = reactive<FormRules>({
  typeName: [{ required: true, message: '请输入文章类型名称', trigger: 'blur' }],
  columnId: [{ required: true, message: '请选择专栏类型', trigger: 'change' }]
});
const dialogTitle = ref('');
const dialogVisible = ref(false);
const add = () => {
  dialogTitle.value = '新增文章类型';
  dialogVisible.value = true;
};
const edit = (row: any) => {
  form.id = row.id;
  form.typeName = row.typeName;
  form.columnId = row.columnId;
  dialogTitle.value = '编辑文章类型';
  dialogVisible.value = true;
};

const del = async (id: number) => {
  let result = await midApi.delArticleType(id);
  if (result) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    });
    getList();
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (dialogTitle.value === '新增文章类型') {
        const data = await midApi.addArticleType({ ...form });
        if (data) {
          ElMessage({
            message: '新增成功',
            type: 'success',
          });
        }
      } else {
        const data = await midApi.updateArticleType({ ...form });
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
  form.typeName = '';
  form.columnId = '';
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
  min-height: 60px;
  margin-bottom: 10px;
}
.col-wrap-inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  .search-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    .el-select {
      width: 150px;
    }
  }
}
</style>