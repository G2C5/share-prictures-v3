import axios, { type InternalAxiosRequestConfig, type AxiosInstance, type AxiosResponse } from 'axios';
import pinia from '@/store/store'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'


const http: AxiosInstance = axios.create({
  baseURL: 'api',
  timeout: 5000,
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // token
    const userStore = useUserStore(pinia)
    if (userStore.loginInfo.token) {
      config.headers.Authorization = 'Bearer ' + userStore.loginInfo.token;
    }
    // if (!userStore.loginInfo.isLogin) {
    //   // 如果用户未登录，则不发送请求，并跳转到登录页面
    //   ElMessage({
    //     showClose: true,
    //     message: '请先登录',
    //     type: 'warning',
    //     duration: 2000
    //   })
    //   // 返回一个 Promise.reject() 来中止请求链
    //   return Promise.reject('User not logged in')
    // }

    return config;
  },
  (error: any) => {
    // 处理请求错误
    return Promise.reject(error);
  },
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error: any) => {
    // 处理响应错误
    console.log('响应错误', error)
    ElMessage({
      showClose: true,
      message: error.response.data.message || '请求失败，请稍后再试',
      type: 'warning',
      duration: 3000
    })
    return Promise.reject(error)
  },
);

export default http;
