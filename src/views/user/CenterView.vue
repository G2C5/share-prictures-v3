<template>
  <div class="user-center-container">
    <!-- 个人 -->
    <div v-if="!isEnterAuthor" class="user-center-nav">
      <div class="nav-item">
        <router-link class="item" active-class="item-selected" :to="{ name: 'dynamic' }"
          >我的动态</router-link
        >
      </div>
      <div class="nav-item">
        <router-link class="item" active-class="item-selected" :to="{ name: 'following' }"
          >我的关注</router-link
        >
      </div>
      <div class="nav-item">
        <router-link class="item" active-class="item-selected" :to="{ name: 'followers' }"
          >我的粉丝</router-link
        >
      </div>
      <div class="nav-item">
        <router-link class="item" active-class="item-selected" :to="{ name: 'infomation' }"
          >我的信息</router-link
        >
      </div>
    </div>
    <!-- 作者 -->
    <div v-else class="user-center-nav">
      <div class="content">
        <div class="author-center-top">
          <el-image class="author-avatar" fit="cover" :src="showInfo.userImg"></el-image>
          <span class="author-name">{{ showInfo.name }}</span>
        </div>
        <div class="author-single-list">
          <div class="author-single-item">
            <div class="item-num">{{ showInfo.followingNum }}</div>
            <div class="item-text">关注</div>
          </div>
          <div class="author-single-item">
            <div class="item-num">{{ showInfo.followersNum }}</div>
            <div class="item-text">粉丝</div>
          </div>
          <div class="author-single-item">
            <div class="item-num">{{ showInfo.uploadCount }}</div>
            <div class="item-text">动态</div>
          </div>
        </div>
      </div>
      <div class="author-sign">
        <p>{{ showInfo.sign }}</p>
      </div>
    </div>
    <div class="router-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import type { FollowersInfo } from '../types/types'
const { proxy } = useCurrentInstance()
const route = useRoute()
const showInfo = ref({} as FollowersInfo) // 展示数据
const isEnterAuthor = computed(() => {
  if (!route.query.userId) {
    return false
  } else {
    getUserInfo()
    return true
  }
})
// 请求用户数据
const getUserInfo = async () => {
  try {
    const userId = route.query.userId
    const result = await proxy.$http.getUserInfo({ userId })
    showInfo.value = result.data
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {})
</script>

<style lang="scss" scoped>
.user-center-container {
  display: flex;
  gap: 10px;
  width: 100%;
  height: 100%;
  .user-center-nav {
    width: 25%;
    height: 100%;
    min-height: 250px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 92px;
    align-items: center;
    gap: 5px;
    padding: 10px;
    background-color: $bgc-color1;
    z-index: 1;
    .nav-item {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .item {
        display: inline-block;
        width: 100%;
        padding: 5px 10px;
        border-radius: 5px;
      }
      .item-selected {
        background-color: $bgc-color2;
      }
    }
    .content {
      width: 100%;
      background-color: $bgc-color2;
      .author-center-top {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        gap: 10px;

        .author-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        .author-name {
          font-weight: bolder;
          font-size: 16px;
        }
      }
      .author-single-list {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .author-single-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          .item-num {
            margin-bottom: 5px;
          }
          .item-text {
            font-size: 14px;
          }
        }
      }
    }
    .author-sign {
      width: 100%;
      padding: 10px;
      border: 2px solid #fff;
      p {
        font-size: 16px;
        text-indent: 2em;
        word-break: break-all;
        line-height: 1.5em;
        letter-spacing: 2px;
      }
    }
  }

  .router-content {
    width: 75%;
  }
}
</style>
