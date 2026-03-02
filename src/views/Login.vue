<template>
  <div class="login">
    <div class="login-form-wrapper">
      <h3>{{ title }}</h3>
      <el-form :model="loginForm" :rules="formRules" ref="ruleFormRef" label-width="60px" class="login-form">
        <el-form-item label="账号" prop="username">
          <el-input style="width: 90%;" v-model.trim="loginForm.username" placeholder="请输入登录账号" clearable
            @keyup.enter="submitForm(ruleFormRef)"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input style="width: 90%;" type="password" v-model.trim="loginForm.password" placeholder="请输入登录密码" clearable
            @keyup.enter="submitForm(ruleFormRef)"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button class="login-btn" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import config from '@config';
import type { FormRules, FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import midApi from '@/apis/mid';
import md5 from 'js-md5';

const router = useRouter();
const userStore = useUserStore();

// 项目名
const title = config.projectTitle;

// 表单
const ruleFormRef = ref<FormInstance>();
const loginForm = reactive({
  username: '', // 账号
  password: '' // 密码
});
const formRules = reactive<FormRules>({
  username: [
    { required: true, message: '账号不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' }
  ]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      if (config.IGNORE_AUTH_CHECK) {
        onLoginSuccess('ignore_auth_check');
      } else {
        const params = {
          username: loginForm.username,
          password: md5(loginForm.password)
        };
        const token = await midApi.login({
          ...params
        });
        onLoginSuccess(token);
      }
    } else {
      console.log('error submit', fields);
    }
  });
};

const onLoginSuccess = (token: string) => {
  ElMessage({
    message: '登录成功',
    type: 'success',
  });
  userStore.token = token;
  router.replace(router.options.routes[0]);
};


</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: var(--bg-color, #ffffff);
  justify-content: center;
  align-items: center;
}

.login-form-wrapper {
  margin: auto;
  position: relative;
  top: -100px;
  width: 360px;
  padding: 30px;
  background-color: var(--content-bg, #fff);
  box-shadow: 0 0 20px 10px rgba(207, 207, 207, 0.5);
  border-radius: 10px;
}

.login-form-wrapper h3 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-color, #bfcbd9);
}

.login-btn {
  width: 100%;
}
</style>