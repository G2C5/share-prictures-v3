<template>
  <div class="container">
    <div class="wrapper">
      <!-- 导航 -->
      <div class="user-container">
        <div class="user-action">
          <!-- 用户头像 -->
          <div class="user-info">
            <img class="user-avatar" :src="userStore.userInfo.userImg" alt="头像" />
            <div class="user-name">{{ userStore.userInfo.name }}</div>
            <div class="user-single-list">
              <div class="user-single-item">
                <div class="item-num">{{ userStore.userInfo.followingNum }}</div>
                <div class="item-text">关注</div>
              </div>
              <div class="user-single-item">
                <div class="item-num">{{ userStore.userInfo.followersNum }}</div>
                <div class="item-text">粉丝</div>
              </div>
              <div class="user-single-item">
                <div class="item-num">{{ userStore.userInfo.uploadCount }}</div>
                <div class="item-text">动态</div>
              </div>
            </div>
          </div>
          <!-- 列表 -->
          <ul class="user-action-list">
            <li>
              <router-link active-class="selected" to="/personalCenter/my-info"
                >个人中心</router-link
              >
            </li>
            <li>
              <router-link active-class="selected" to="/personalCenter/my-share"
                >我的图集</router-link
              >
            </li>
            <li>
              <router-link active-class="selected" to="/personalCenter/my-collect"
                >我的收藏</router-link
              >
            </li>
            <li>
              <router-link active-class="selected" to="/personalCenter/my-history"
                >浏览历史</router-link
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- 内容 -->
      <div class="user-action-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
</script>

<style lang="scss" scoped>
.container {
  margin-top: 10px;
  .wrapper {
    .user-container {
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      z-index: 22;
      gap: 10px;
      border-bottom: 1px solid $bgc-color2;

      .user-action {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 10px;
        background-color: $bgc-color1;

        .user-info {
          display: flex;
          align-items: center;
          .user-avatar {
            width: 60px;
            border-radius: 50%;
            margin-right: 15px;
          }
          .user-name {
            font-size: 18px;
            font-weight: bolder;
            text-wrap: nowrap;
          }
          .user-single-list {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .user-single-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 10px 20px;
            }
          }
        }
        .user-action-list {
          display: flex;
          align-items: center;
          li {
            padding: 0 10px;
            font-size: 16px;
            a {
              color: $text-color2;
              font-weight: bold;
            }
          }
          .selected {
            color: $text-color-activity2;
            text-shadow: 0 0 2px $text-color1;
          }
        }
      }
    }
    .user-action-content {
      margin-top: 10px;
      width: 100%;
      height: 100%;
      min-height: 80vh;
    }
  }
}
</style>
