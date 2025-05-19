<template>
  <div class="my-atlas-container">
    <div class="container-header">
      <div><h3>我的图集</h3></div>
    </div>
    <div class="atlas-item" v-for="(item, index) in myShareImage" :key="item._id">
      <div class="image-time">{{ item.date }}</div>
      <div class="image-item">
        <div class="image-box" v-for="(url, index) in item.imageUrl" :key="index">
          <el-image
            style="height: 100%; width: 140px"
            class="image-style"
            :class="{ lifted: isHovered }"
            fit="cover"
            :src="url"
            @click="openPictureDetail(item._id)"
          ></el-image>
        </div>
      </div>
      <div class="image-info">
        <div class="image-text">
          <div class="image-title">
            <h3>{{ item.title }}</h3>
          </div>
          <div class="image-description">
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-if="!myShareImage.length">
      <span>没有上传过图片━━∑(￣□￣*|||━━</span>
      <router-link class="go-share" :to="{ name: 'share' }">去分享?</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import type { MyShareImage } from '../types/types'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import usePicture from '@/hooks/usePicture'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const { openPictureDetail } = usePicture()
const { proxy } = useCurrentInstance()
const isHovered = ref(false)
const myShareImage = ref([] as MyShareImage[])
const pagination = reactive({ page: 1, pageSize: 5 })
// 请求：我的图集
const getMyShareImage = async () => {
  const result = await proxy.$http.getMyShareImage(pagination)
  pagination.page++
  myShareImage.value = [...myShareImage.value, ...result.data]
  try {
  } catch (error) {
    console.log(error)
  }
}
const isNoMoreData = computed(() => {
  if (myShareImage.value.length === userStore.userInfo.uploadCount) {
    return true
  } else {
    return false
  }
})
// 触底事件
const { isBottom } = useInfiniteScroll({ threshold: 100 })

const unwatch = watch(isBottom, (newIsBottom) => {
  if (newIsBottom && !isNoMoreData.value) {
    getMyShareImage()
  }
})
onMounted(() => {
  getMyShareImage()
})
onUnmounted(() => {
  unwatch()
})
</script>

<style lang="scss" scoped>
.my-atlas-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 80vh;
  background-color: $bgc-color1;
  .container-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 60px;
    background-color: $bgc-color2;
  }
  .atlas-item {
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 100%;
    margin-top: 40px;
    padding: 0px 30px;
    border-top: 4px solid $text-color1;

    .image-item {
      display: flex;
      gap: 20px;
      align-items: center;

      .image-box {
        height: 140px;
        transform-style: preserve-3d;
        perspective: 1000px; /* 设置视距 */
        perspective-origin: left;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: -10px;
          left: 5px;
          width: 10px;
          height: 20px;
          background-color: rgb(255, 255, 255);
          transform: rotateX(9deg) skewX(3deg);
          z-index: 1;
        }
        &::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 120px;
          width: 10px;
          height: 20px;
          background-color: rgb(170, 91, 91);
          transform: rotateX(9deg) skewX(3deg);
          z-index: 1;
        }

        .image-style {
          border: 5px solid #fff;
          border-radius: 5px;
          transition:
            transform 0.3s ease-in-out,
            box-shadow 0.4s ease;
          cursor: pointer;
          transform-origin: top right;
          box-shadow:
            4px 4px 10px rgba(0, 0, 0, 0.3),
            7px 4px 20px 0 rgba(0, 0, 0, 0.5);
        }
      }

      .image-style:hover {
        transform: rotateX(9deg) skewX(3deg);
        box-shadow:
          -5px 20px 14px rgba(0, 0, 0, 0.3),
          5px 20px 18px 7px rgba(0, 0, 0, 0.5);
      }
      .image-box:hover {
        &::after {
          transform: rotateX(9deg) skewX(3deg);
        }
      }
    }
    .image-info {
      position: relative;
      padding: 4px 10px;
      box-shadow: 9px 7px 10px 5px #a0a0a0;
      width: 350px;
      transform-origin: top left;
      transition:
        transform 0.3s ease,
        box-shadow 0.4s ease;
      .image-text {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: linear-gradient(transparent 95%, #424949 0);
        line-height: 1.5em;
        background-size: 100% 1.5em;
        background-attachment: local;
        transition: transform 0.3s ease;

        .image-title {
          text-align: center;
          padding: 0 10px;
        }
        .image-description {
          p {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 4; /* 显示4行文字 */
            line-height: 1.5; /* 设置行高，可以根据需要调整 */
            max-height: 6em; /* 设置最大高度，4行文字 * 行高 */
            text-overflow: ellipsis; /* 显示省略号 */
            text-indent: 2em;
          }
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -15px;
        width: 50px;
        height: 10px;
        background-color: #424949;
        transform: rotateZ(-30deg);
      }
      &::after {
        content: '';
        position: absolute;
        top: 20px;
        right: -15px;
        background-color: #424949;
        height: 10px;
        width: 50px;
        transform: rotateZ(10deg);
        box-shadow: 20px 3px 20px 2px #a0a0a0;
      }
    }
    .image-info:hover {
      transform: rotateZ(4deg);
      box-shadow: 6px 8px 10px 5px #a0a0a0;

      &::before {
        transform: rotateZ(-40deg);
      }
    }
    .image-time {
      position: absolute;
      top: -34px;
      left: 0;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      background-color: $bgc-color2;
      border-radius: 20px;
      box-shadow: 13px 9px 10px 0px rgba($color: #424949, $alpha: 0.3);
      z-index: 1;
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
    .go-share {
      color: $text-color-activity1;
    }
  }
}
</style>
