
export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import('@/views/RankShareImage.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/fine',
    name: 'fine',
    component: () => import('@/views/FindVirtualWaterFall.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/share',
    name: 'share',
    component: () => import('@/views/uploadShareImage.vue'),
    meta: {
      defaultShow: false
    }
  },
  {
    path: '/pictureDetali',
    name: 'pictureDetali',
    component: () => import('@/views/PictureDetailView.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/personalCenter',
    name: 'personalCenter',
    redirect: '/personalCenter/my-info',
    component: () => import('@/views/PersonalCenterView.vue'),
    meta: {
      defaultShow: false
    },
    children: [
      {
        name: 'myShare',
        path: 'my-share',
        component: () => import('../views/user/ShareView.vue')
      },
      {
        name: 'myCollect',
        path: 'my-collect',
        component: () => import('../views/user/CollectView.vue')
      },
      {
        name: 'myHistory',
        path: 'my-history',
        component: () => import('../views/user/HistoryView.vue')
      },
      {
        name: 'myInfo',
        path: 'my-info',
        redirect: '/personalCenter/my-info/dynamic',
        component: () => import('@/views/user/CenterView.vue'),
        children: [
          {
            name: 'infomation',
            path: 'infomation',
            component: () => import('@/views/user/center/Infomation.vue')
          },
          {
            name: 'dynamic',
            path: 'dynamic',
            component: () => import('@/views/user/center/Dynamic.vue')
          },
          {
            name: 'followers',
            path: 'followers',
            component: () => import('@/views/user/center/Followers.vue')
          },
          {
            name: 'following',
            path: 'following',
            component: () => import('@/views/user/center/Following.vue')
          },
        ]
      },
    ]
  },
  {
    path: '/userHomePage',
    name: 'userHomePage',
    component: () => import('@/views/UserHomePage.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/components/test.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../views/404.vue'),
    meta: {
      defaultShow: true
    }
  },
  {
    path: '/',
    redirect: '/home'
  }
]