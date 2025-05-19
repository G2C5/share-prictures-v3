import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { useUserStore } from '@/store/user'


const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  let token = userStore.loginInfo.token;
  // 检查路由是否需要验证身份
  if (to.meta.defaultShow) {
    if (token) {
      if (to.path === '/login' || to.path === '/register') {
        console.log(to.path)
        next('/rank')
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
