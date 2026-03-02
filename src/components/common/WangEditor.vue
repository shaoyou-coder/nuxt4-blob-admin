<template>
  <div>
    <div class="wang-editor">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        class="wang-toolbar"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        :autoFocus="true"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onDestroyed="handleDestroyed"
      />
    </div>
  </div>
</template>

<script setup>
import '@wangeditor-next/editor/dist/css/style.css';
import { onBeforeUnmount, shallowRef, ref, nextTick } from 'vue';
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import { ElMessage } from 'element-plus';

// 编辑器实例
const editorRef = shallowRef();
const isEditorReady = ref(false);
const isDestroyed = ref(false);

// 使用 defineModel 或传统方式
const valueHtml = defineModel();

const mode = ref('default');
const toolbarConfig = ref({});
const editorConfig = ref({
  placeholder: '请输入内容...',
  MENU_CONF: {}
});

// 配置上传图片
editorConfig.value.MENU_CONF['uploadImage'] = {
  server: import.meta.env.WD_BASE_URL + '/common/uploadByOss',
  customInsert(res, insertFn) {
    if (res.errCode === 'e0000') {
      insertFn(res.body);
    } else {
      ElMessage.error('图片上传失败');
    }
  },
};

// 编辑器创建回调
const handleCreated = (editor) => {
  console.log('编辑器创建成功', editor);
  editorRef.value = editor;
  isEditorReady.value = true;
  isDestroyed.value = false;
};

// 编辑器销毁回调
const handleDestroyed = () => {
  console.log('编辑器已销毁');
  isEditorReady.value = false;
  isDestroyed.value = true;
  editorRef.value = null;
};

// 安全的初始化内容方法
const initContent = async (content) => {
  // 等待编辑器准备就绪
  if (!isEditorReady.value) {
    await new Promise(resolve => {
      const checkReady = () => {
        if (isEditorReady.value && editorRef.value) {
          resolve();
        } else if (!isDestroyed.value) {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  // 再次检查编辑器是否存在
  if (!editorRef.value || isDestroyed.value) {
    console.warn('编辑器未就绪或已销毁');
    return;
  }

  try {
    // 使用 nextTick 确保 DOM 更新完成
    await nextTick();
    editorRef.value.setHtml(content || '');
    valueHtml.value = content || '';
    console.log('内容初始化成功');
  } catch (error) {
    console.error('初始化内容失败:', error);
  }
};

// 组件销毁时清理
onBeforeUnmount(() => {
  isDestroyed.value = true;
  isEditorReady.value = false;

  const editor = editorRef.value;
  if (!editor) return;

  try {
    editor.destroy();
    editorRef.value = null;
  } catch (error) {
    console.warn('编辑器销毁时出错:', error);
  }
});

// 暴露方法给父组件
defineExpose({
  initContent
});
</script>

<style scoped lang="less">
.wang-editor {
  border: 1px solid var(--border-color, #dcdfe6);
}

.wang-toolbar {
  border-bottom: 1px solid var(--border-color, #ccc);
}
</style>