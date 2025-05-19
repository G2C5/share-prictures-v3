<template>
  <div class="history-container">
    <div class="container-header">
      <div><h3>浏览历史</h3></div>
    </div>
    <div v-if="historyData.length" class="history-content">
      <el-timeline>
        <el-timeline-item
          v-for="(h, i) in historyData"
          :key="h.imageId"
          :timestamp="h.date"
          placement="top"
        >
          <el-card>
            <div class="history-item">
              <div class="history-info">
                <div class="info-left">
                  <el-image class="image-style" fit="cover" :src="h.imageUrl"></el-image>
                </div>
                <div class="info-right">
                  <div class="title">
                    {{ h.title }}
                  </div>
                  <div class="author">{{ h.name }}</div>
                </div>
              </div>
              <div class="history-del-action">
                <div>
                  <el-button @click="delHistory(i)" color="#e88" plain size="small">
                    删除
                  </el-button>
                </div>
                <div>
                  <el-button @click="goHistory(h.imageId)" color="#0ee" plain size="small">
                    查看
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div v-else class="empty">
      <span>没有任何记录 Σ(°△°|||)︴</span>
      <router-link class="go-rank" :to="{ name: 'rank' }">去逛逛?</router-link>
    </div>
    <div class="no-more" v-show="historyData.length">
      <span>没有更多了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import Local from '@/utils/localStorage'
const router = useRouter()
const historyData = ref<
  Array<{
    date: string
    imageId: string
    imageUrl: string
    name: string
    title: string
    userId: string
  }>
>([])
const getLocalHistory = () => {
  try {
    const data = Local.getItem<{ history: any[] }>('SHARE_HISTORY') || { history: [] }
    historyData.value = data.history
  } catch (error) {
    console.log(error)
  }
}
// 删除历史记录
const delHistory = (index: number) => {
  // 从历史记录中移除指定索引位置的记录
  historyData.value.splice(index, 1)
  // 更新本地存储的历史记录数据
  Local.setItem('SHARE_HISTORY', { history: historyData.value })
}
// 查看详情
const goHistory = (imageId: string) => {
  const url = router.resolve({
    name: 'pictureDetali',
    query: { imageId: imageId }
  })
  window.open(url.href, '_blank')
}
onMounted(() => {
  getLocalHistory()
})
</script>

<style lang="scss" scoped>
.history-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 80vh;
  background-color: $bgc-color1;

  .container-header {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: $bgc-color2;
  }
  .history-content {
    width: 100%;
    height: 100%;
    padding: 0 50px;
    .history-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      .history-info {
        display: flex;
        gap: 30px;
        width: 100%;
        .info-left {
          .image-style {
            max-width: 120px;
            max-height: 120px;
            height: 120px;
            width: 120px;
          }
        }
        .info-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 0;

          .title {
            width: 100%;
            font-size: 18px;
            font-weight: bolder;
          }
          .author {
            widows: 100%;
          }
        }
      }
      .history-del-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
      }
    }
  }
  .empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    span {
      color: $text-color3;
    }
    .go-rank {
      color: $text-color-activity1;
    }
  }
  .no-more {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      padding: 10px;
      color: $text-color3;
    }
  }
}
</style>
