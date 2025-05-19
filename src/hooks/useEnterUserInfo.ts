import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

// 图片
export default function useEnterUserInfo() {
  const router = useRouter()
  const userSotre = useUserStore()
  // 进入图片详情页
  const openUserDynamic = (userId: string) => {
    try {
      let url
      if (userSotre.userInfo._id === userId) {
        url = router.resolve({
          name: 'dynamic',
          query: { userId }
        })

      } else {
        url = router.resolve({
          name: 'userHomePage',
          query: { userId }
        })
      }
      window.open(url.href, '_blank')
    } catch (error) {
      console.log(error)
    }
  }

  return {
    openUserDynamic
  }
}
