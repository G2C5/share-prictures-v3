<template>
  <div class="my-collect-container">
    <div class="collect-box">
      <!-- 标栏 -->
      <div class="container-header">
        <div><h3>我的收藏</h3></div>
        <div class="header-right">
          <span class="center-num">收藏：{{ pagination.total }}</span>
          <PsPagination
            :total="pagination.total"
            v-model:page="pagination.page"
            v-model:size="pagination.pageSize"
            @change="handlePageChange"
          />
        </div>
      </div>
      <!-- 内容 -->
      <div class="collect-content" v-if="pagination.total">
        <div
          v-for="(c, index) in collect"
          :key="c._id"
          class="collect-item"
          :style="{ backgroundImage: 'url(' + c.imageUrl[0].url + ')' }"
          @click="openPictureDetail(c._id)"
        >
          <div class="item-info">
            <span class="item-title">{{ c.title }}</span>
            <span class="item-views">
              <SvgIcon iconName="icon-views1" />
              <span class="views-num">{{ c.views }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 空 -->
    <div class="empty" v-if="!pagination.total">
      <span>没有收藏任何东西━━∑(￣□￣*|||━━</span>
      <router-link class="go-rank" :to="{ name: 'rank' }">去看看?</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import PsPagination from '@/components/PsPagination/PsPagination.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import usePicture from '@/hooks/usePicture'
const { proxy } = useCurrentInstance()
const { openPictureDetail } = usePicture()
const router = useRouter()
const pagination = ref({
  page: 1,
  pageSize: 12,
  total: 0
})
const userStore = useUserStore()
const collect = ref()
const handlePageChange = async () => {
  try {
    const result = await proxy.$http.getUserCollect({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    pagination.value.total = result.data.total
    collect.value = result.data.collectedImages
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  handlePageChange()
})
</script>

<style lang="scss" scoped>
.my-collect-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 80vh;
  background-color: $bgc-color1;
  .collect-box {
    width: 100%;
    height: 100%;
    .container-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      height: 60px;
      background-color: $bgc-color2;
      .center-num {
        color: $text-color3;
        text-align: center;
        margin-right: 10px;
      }
      .header-right {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }
    .collect-content {
      height: auto; // 修改为自动高度
      padding: 5px;
      margin-top: 10px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 10px;
      border-bottom: 2px solid #fff;
      .collect-item {
        position: relative;
        height: 200px; // 固定 collect-item 的高度
        background-position: center;
        background-size: cover;
        border-radius: 5px;
        border: 5px solid #fff;
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
        &:hover {
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
          transform: rotate(3deg) scale(1.03); // 鼠标悬停时旋转3度
        }
        .item-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 0 10px;
          width: 100%;
          height: 30px;
          background-color: rgba($color: $bgc-color3, $alpha: 0.7);
          color: $text-color2;
          opacity: 1;
          transition: opacity 0.3s ease;
          .item-title {
            width: 160px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: bolder;
          }
          .item-views {
            .views-num {
              margin-right: 5px;
            }
          }
        }
        &:hover .item-info {
          opacity: 0;
        }
      }
      .collect-item::before {
        content: '';
        width: 100%;
        height: 5px;
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
}
</style>
