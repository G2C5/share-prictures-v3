import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import Local from '@/utils/localStorage'


export const usePictureStore = defineStore('picture', () => {
  const { proxy } = useCurrentInstance() // 全局api
  const rankImgData = reactive({
    latest: [],// 最新分享
    recommend: [],// 站点推荐
    history: [], // 历史最多观看
  });
  // 请求最新分享数据
  const getLatestImg = async (page: number, pageSize: number) => {
    try {
      const result = await proxy.$http.latestSharing(page, pageSize);
      const data: [] = result.data.map((i: any) => ({
        imageId: i._id,
        userId: i.userId,
        imageUrl: i.imageUrl.url,
        width: i.imageUrl.width,
        height: i.imageUrl.height,
        title: i.title,
        description: i.description,
        tags: i.tags,
        views: i.views,
        collect: i.collect,
        like: i.like,
        date: i.date
      }))
      rankImgData.latest.push(...data)
    } catch (error) {
      console.log('请求最新分享失败', error)
    }

  }
  // 请求站点推荐数据
  const getRecommendImg = async () => {
    try {
      const result = await proxy.$http.siteRecommended();
      const data: [] = result.data.map((i: any) => ({
        imageId: i._id,
        userId: i.userId,
        imageUrl: i.imageUrl.url,
        width: i.imageUrl.width,
        height: i.imageUrl.height,
        title: i.title,
        description: i.description,
        tags: i.tags,
        views: i.views,
        collect: i.collect,
        like: i.like,
        date: i.date
      }))
      rankImgData.latest.push(...data)
    } catch (error) {
      console.log('请求站点推荐失败', error)
    }

  }
  // 请求历史观看最多数据
  const getHistoryImg = async (page: number, pageSize: number) => {
    try {
      const result = await proxy.$http.greatestHistory(page, pageSize);
      const data: [] = result.data.map((i: any) => ({
        imageId: i._id,
        userId: i.userId,
        imageUrl: i.imageUrl.url,
        width: i.imageUrl.width,
        height: i.imageUrl.height,
        title: i.title,
        description: i.description,
        tags: i.tags,
        views: i.views,
        collect: i.collect,
        like: i.like,
        date: i.date
      }))
      rankImgData.latest.push(...data)
    } catch (error) {
      console.log('请求历史观看最多失败', error)
    }

  }
  // 保存本地

  return {
    latest: rankImgData.latest,
    recommend: rankImgData.recommend,
    history: rankImgData.history,
    getLatestImg, getRecommendImg, getHistoryImg
  }
})
