import { ElMessage } from 'element-plus';
import axios, { type AxiosRequestConfig } from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { useUserStore } from '@/stores/user';

// 创建一个axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.WD_BASE_URL,
  timeout: 30000
});

// 请求拦截器
service.interceptors.request.use((config: any) => {
  // 除了登录接口都需要添加token
  if (!config.url.includes('login')) {
    const userStore = useUserStore();
    config.headers['token'] = userStore.token;
  }
  return config;
}, (error: AxiosError) => {
  ElMessage.error(error);
  return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use((response: any) => {
  const {
    errCode,
    errMessage,
    body
  } = response.data;

  // 判断请求是否成功
  if (errCode === 'e0000') {
    return body;
  } else if (errCode === 'e0002') {
    ElMessage.error(errMessage);
    const userStore = useUserStore();
    const router = useRouter();
    userStore.loginOut();
    router.replace('/login');
  } else {
    ElMessage.error(errMessage);
    return Promise.reject(new Error(errMessage));
  }
}, (error: AxiosError) => {
  // 处理 HTTP 网络错误
  let message = '';
  // HTTP 状态码
  const status = error.response?.status;
  switch (status) {
    case 401:
      message = 'token 失效，请重新登录';
      break;
    case 403:
      message = '拒绝访问';
      break;
    case 404:
      message = '请求地址错误';
      break;
    case 500:
      message = '服务器繁忙';
      break;
    default:
      message = '网络连接错误';
  }
  ElMessage.error(message);
  return Promise.reject(error);
});

// 请求方法封装
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  }
};