import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import Local from '@/utils/localStorage'
import { jwtDecode } from "jwt-decode";
import { watch } from 'vue'
import type { TokenInfo, UserInfo } from './types/type'

export const useUserStore = defineStore('user', () => {
  const loginInfo = reactive<{ token: string, isLogin: boolean }>({
    token: '',
    isLogin: false,
    ...Local.getItem("SHARE_TOKEN_INFO")
  })
  const userInfo = ref<UserInfo>({
    username: '',
    followersNum: 0,
    followingNum: 0,
    isaAdmin: '0',
    name: '',
    userImg: '',
    _id: '',
    uploadCount: 0,
    sign: '',
    ...Local.getItem("SHARE_USER_INFO")
  })
  // 检查令牌是否过期
  function isTokenExpired(expirationTime: number) {
    const currentTime = Math.floor(Date.now() / 1000);
    return expirationTime < currentTime;
  }
  // 处理令牌过期
  function handleTokenExpired() {
    Local.removeItem("SHARE_USER_INFO")
    Local.removeItem("SHARE_TOKEN_INFO")
    loginInfo.isLogin = false
  }
  // 初始化仓库数据
  const initUserInfo = ({ token, data }: { token?: string, data?: UserInfo }) => {
    console.log('store', data)
    let initToken
    if (!token) {
      initToken = loginInfo.token
    } else {
      initToken = token
    }
    const decodedToken: TokenInfo = jwtDecode(initToken);
    const tokenExpired = isTokenExpired(decodedToken.exp);
    if (tokenExpired) {
      // 令牌已过期，执行相应的操作，例如重新登录或者跳转到登录页面
      handleTokenExpired();
    } else {
      // 令牌未过期，继续正常操作
      loginInfo.token = initToken
      if (data) Object.assign(userInfo.value, data);
      // 本地保存jwt
      Local.setItem('SHARE_USER_INFO', userInfo.value)
      Local.setItem('SHARE_TOKEN_INFO', { token: initToken })
      loginInfo.isLogin = true
    }
  }

  // // 监视token信息变化
  watch(() => loginInfo.token, (newToken, oldToken) => {
    if (newToken) {
      console.log('init newToken')
      initUserInfo({ token: newToken })
    } else {
      console.log('init newToken error');
    }
  }, { immediate: true });
  // 监视用户信息，并存储
  watch(userInfo, (newValue, oldValue) => {
    if (newValue) {
      console.log('init user information')
      Local.setItem('SHARE_USER_INFO', userInfo.value)
    } else {
      console.log('user information is undefined or null');
    }
  });

  return {
    loginInfo, userInfo, initUserInfo
  }
})