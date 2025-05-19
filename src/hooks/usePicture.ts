import { useRouter } from 'vue-router'

// 图片
export default function usePicture() {
  const router = useRouter()
  // 进入图片详情页
  const openPictureDetail = (id: string): void => {
    const url = router.resolve({
      name: 'pictureDetali',
      query: { imageId: id }
    })
    window.open(url.href, '_blank')
  }

  return {
    openPictureDetail
  }
}
