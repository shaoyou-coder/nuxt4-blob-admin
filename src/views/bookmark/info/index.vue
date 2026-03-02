<template>
  <div class="column-wrap">
    <div class="col-wrap">
      <div class="col-wrap-inner">
        <el-button type="primary" @click="add">新增</el-button>
        <div class="search-item">
          <p>书签栏：</p>
          <el-select v-model="search.colId" clearable @change="handleSearch">
            <el-option v-for="item in colList" :key="item.id" :label="item.colName" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <TableComp :width="'100%'" :border="true" :data="list" :colConfigs="colConfigs">
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
      :fullscreen="isMobile() ? true : false"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :show-close="false"
    >
      <el-form ref="ruleFormRef" :model="form" :rules="rules" :label-position="labelPosition" label-width="120">
        <el-form-item label="书签名" prop="bookmarkName">
          <el-input v-model="form.bookmarkName" />
        </el-form-item>
        <el-form-item label="书签描述" prop="bookmarkDesc">
          <el-input v-model="form.bookmarkDesc" type="textarea" />
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <UploadImgComp v-model="form.cover" :imgConfig="imgConfig"></UploadImgComp>
        </el-form-item>
        <el-form-item label="所属书签栏" prop="colId">
          <el-select v-model="form.colId">
            <el-option v-for="item in colList" :key="item.id" :label="item.colName" :value="item.id"></el-option>
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
import UploadImgComp from '@/components/common/UploadImgComp.vue';
import PaginationComp from '@/components/common/PaginationComp.vue';
import midApi from '@/apis/mid';
import type { colConfigType } from '#types/TableType';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { isMobile } from '@/utils/commonUtils';

const list = ref([]);
const search = reactive({
  colId: ''
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
type BookmarkType = {
  id: number,
  colName: string
}
const colList = ref<Array<BookmarkType>>([]);
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
    prop: 'bookmarkName',
    label: '书签名',
  },
  {
    prop: 'bookmarkDesc',
    label: '书签描述',
  },
  {
    prop: 'cover',
    label: '封面',
    isImg: true,
  },
  {
    prop: 'url',
    label: '跳转链接',
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
  };
  const data = await midApi.getAllMark(params);
  list.value = data.list;
  total.value = data.total;
};
const getColList = async () => {
  const data = await midApi.getAllCol();
  colList.value = data;
};
const handleSearch = async () => {
  pageInfo.pageNum = 1;
  const params = {
    ...pageInfo,
    colId: search.colId
  };
  const data = await midApi.getAllMark(params);
  list.value = data.list;
  total.value = data.total;
};
const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val;
  getList(pageInfo);
};
const handleCurrentChange = (val: number) => {
  pageInfo.pageNum = val;
  getList(pageInfo);
};
onMounted(() => {
  getList(pageInfo);
  getColList();
});

const labelPosition = computed(() => {
	return isMobile() === true ? 'top' : 'right';
});
const ruleFormRef = ref<FormInstance>();
const form = reactive({
  id: null,
  bookmarkName: '',
  bookmarkDesc: '',
  cover: '',
  url: '',
  colId: ''
});
const rules = reactive<FormRules>({
  bookmarkName: [{ required: true, message: '请输入书签名', trigger: 'blur' }],
  bookmarkDesc: [{ required: true, message: '请输入书签描述', trigger: 'blur' }],
  url: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  colId: [{ required: true, message: '请选择关联书签栏', trigger: 'change' }]
});
const dialogTitle = ref('');
const dialogVisible = ref(false);
const add = () => {
  dialogTitle.value = '新增书签';
  dialogVisible.value = true;
};
const edit = (row: any) => {
  form.id = row.id;
  form.bookmarkName = row.bookmarkName;
  form.bookmarkDesc = row.bookmarkDesc;
  form.url = row.url;
  form.cover = row.cover;
  form.colId = row.colId;
  dialogTitle.value = '编辑书签';
  dialogVisible.value = true;
};

const del = async (id: number) => {
  let result = await midApi.delMark(id);
  if (result) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    });
    getList(pageInfo);
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (dialogTitle.value === '新增书签') {
        const data = await midApi.addMark({ ...form });
        if (data) {
          ElMessage({
            message: '新增成功',
            type: 'success',
          });
        }
      } else {
        const data = await midApi.updateMark({ ...form });
        if (data) {
          ElMessage({
            message: '更新成功',
            type: 'success',
          });
        }
      }
      handleClose(formEl);
      getList(pageInfo);
    } else {
      console.log('error submit!', fields);
    }
  });
};
const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  form.bookmarkName = '';
  form.bookmarkDesc = '';
  form.url = '';
  form.cover = '';
  form.colId = '';
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