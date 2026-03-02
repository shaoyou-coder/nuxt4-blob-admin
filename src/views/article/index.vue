<template>
  <div class="column-wrap">
    <div class="col-wrap">
      <div class="col-wrap-inner">
        <el-button type="primary" @click="add">新增</el-button>
        <div class="search-item">
          <p>文章类型：</p>
          <el-cascader clearable :options="cascaderOptions" :show-all-levels="false" @change="handleSearch" />
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
    <div style="margin-top: 15px;">
      <PaginationComp :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></PaginationComp>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fullscreen="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :show-close="false"
    >
      <el-form ref="ruleFormRef" :model="form" :rules="rules" :label-position="labelPosition" label-width="120">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <UploadImgComp v-model="form.cover" :imgConfig="imgConfig"></UploadImgComp>
        </el-form-item>
        <el-form-item label="所属文章类型" prop="typeId">
          <el-cascader v-model="form.typeId" :options="cascaderOptions" :show-all-levels="false" @change="handleChangeCascader" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <template v-if="dialogVisible">
            <div style="width: 100%;">
              <WangEditor v-model="form.content"></WangEditor>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef, true)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import PaginationComp from '@/components/common/PaginationComp.vue';
import TableComp from '@/components/common/TableComp.vue';
import WangEditor from '@/components/common/WangEditor.vue';
import UploadImgComp from '@/components/common/UploadImgComp.vue';
import midApi from '@/apis/mid';
import type { colConfigType } from '#types/TableType';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { isMobile } from '@/utils/commonUtils';

const list = ref([]);
const search = reactive<{ typeId: string | null }>({
  typeId: ''
});
const total = ref(0);
type PageInfoType = {
  pageNum: number,
  pageSize: number,
}
const pageInfo: PageInfoType = reactive({
  pageNum: 1,
  pageSize: 10,
});
const cascaderOptions = ref<CascaderOption[]>([]);
const imgConfig = reactive({
  width: 0,
  height: 0
});
const colConfigs = ref<Array<colConfigType>>([
  {
    prop: 'id',
    label: 'id',
    width: '120',
  },
  {
    prop: 'title',
    label: '标题',
  },
  {
    prop: 'description',
    label: '描述',
  },
  {
    prop: 'cover',
    label: '封面',
    isImg: true,
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
const getList = async (pageInfo: object) => {
  const params = {
    ...pageInfo,
    ...search
  };
  const data = await midApi.getAllArticle(params);
  list.value = data.list;
  total.value = data.total;
};
const getAllColumn = async () => {
  const data = await midApi.getAllColumn();
  return data;
};
type ColumnItem = { id: number; columnName: string };
type TypeItem = { id: number; columnId: number; typeName: string };
type CascaderOption = { value: number; label: string; children: Array<{ value: number; label: string }> };

const getTypeList = async () => {
  const allColumn = await getAllColumn();
  const data = await midApi.getAllArticleType();
  let options: CascaderOption[] = (allColumn as ColumnItem[]).map((item) => {
    return {
      value: item.id,
      label: item.columnName,
      children: [],
    };
  });
  (data as TypeItem[]).forEach((item) => {
    const findItem = options.find(({ value }: { value: number }) => item.columnId === value);
    if (findItem) {
      findItem.children.push({
        value: item.id,
        label: item.typeName,
      });
    }
  });
  cascaderOptions.value = options;
};

const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val;
  getList(pageInfo);
};
const handleCurrentChange = (val: number) => {
  pageInfo.pageNum = val;
  getList(pageInfo);
};
const handleSearch = async (val: number[] | null) => {
  if (val) {
    search.typeId = String(val[1]);
  } else {
    search.typeId = null;
  }
  pageInfo.pageNum = 1;
  getList(pageInfo);
};
const handleSwitchChange = async (row: { id?: number; status: number }) => {
  if (!row.id) return;
  row.status === 0 ? row.status = 1 : row.status = 0;
  let result = await midApi.updateArticleStatus({
    id: row.id,
    status: row.status === 0 ? 1 : 0
  });
  if (result) {
    ElMessage({
      message: '操作成功',
      type: 'success',
    });
    getList(pageInfo);
  }
};
onMounted(() => {
  getList(pageInfo);
  getTypeList();
  window.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      // 判断当前是否处于编辑状态
      if (dialogVisible.value && dialogTitle.value === '编辑文章') {
        submitForm(ruleFormRef.value, false);
      }
    }
  });
});

const labelPosition = computed(() => {
	return isMobile() === true ? 'top' : 'right';
});
const ruleFormRef = ref<FormInstance>();
const form = reactive({
  id: null,
  title: '',
  description: '',
  cover: '',
  content: '',
  typeId: ''
});
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  typeId: [{ required: true, message: '请选择关联类型', trigger: 'change' }]
});
const dialogTitle = ref('');
const dialogVisible = ref(false);
const add = () => {
  dialogTitle.value = '新增文章';
  dialogVisible.value = true;
};
const edit = (row: any) => {
  form.id = row.id;
  form.title = row.title;
  form.description = row.description;
  form.cover = row.cover;
  form.content = row.content;
  form.typeId = row.typeId;
  dialogTitle.value = '编辑文章';
  dialogVisible.value = true;
};

const handleChangeCascader = (val: any) => {
  form.typeId = val[1];
};

const del = async (id: number) => {
  let result = await midApi.delArticle(id);
  if (result) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    });
    getList(pageInfo);
  }
};

const submitForm = async (formEl: FormInstance | undefined, isClose: boolean) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (dialogTitle.value === '新增文章') {
        const data = await midApi.addArticle({ ...form });
        if (data) {
          ElMessage({
            message: '新增成功',
            type: 'success',
          });
        }
      } else {
        const data = await midApi.updateArticle({ ...form });
        if (data) {
          ElMessage({
            message: '更新成功',
            type: 'success',
          });
        }
      }
      if (isClose) {
        handleClose(formEl);
        getList(pageInfo);
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};
const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  form.title = '';
  form.description = '';
  form.cover = '';
  form.content = '';
  form.typeId = '';
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