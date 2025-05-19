<template>
  <div class="app-container">
    <!-- 导航 -->
    <nav class="navbar" ref="navbarRef">
      <div class="navbar-container">
        <!-- 左边：logo、导航、菜单 -->
        <div class="navbar-left">
          <!-- logo -->
          <div class="logo">
            <h2>
              <router-link to="/">
                <img class="logo-img" src="../public/images/logo.png" />
              </router-link>
            </h2>
          </div>
          <!-- 导航 -->
          <ul class="navbar-links" :class="{ 'show-menu': isMenuOpen }">
            <li>
              <router-link active-class="link-active" to="/home">首页</router-link>
            </li>
            <li><router-link active-class="link-active" to="/rank">排行</router-link></li>
            <li><router-link active-class="link-active" to="/fine">发现</router-link></li>
            <li><router-link active-class="link-active" to="/share">分享</router-link></li>
            <li v-if="isLogin">
              <router-link active-class="link-active" to="/personalCenter">个人</router-link>
            </li>
          </ul>
        </div>
        <!-- 右边：用户 -->
        <div class="navbar-right">
          <button @click="toggleTheme">Toggle Theme</button>
          <div
            v-if="isLogin"
            class="navbar-avatar-container"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <!-- 用户头像弹窗 -->
            <transition name="popover">
              <div
                v-if="showPopover"
                @mouseenter="popoverMouseEnter"
                @mouseleave="popoverMouseLeave"
                class="popover"
              >
                <div class="user-info">
                  <!-- 用户名 -->
                  <router-link :to="{ name: 'personalCenter' }" class="user-name">
                    <span>{{ userInfo.name }}</span>
                  </router-link>
                  <!-- 用户：粉丝数据 -->
                  <div class="user-single-list">
                    <!-- 关注 -->
                    <router-link
                      :to="{ name: 'following' }"
                      :class="{ 'single-item-active': activeIndex === 0 }"
                      @mouseenter="activeIndex = 0"
                      @mouseleave="activeIndex = -1"
                      class="user-single-item"
                    >
                      <div class="count-num">{{ userInfo.followingNum }}</div>
                      <div class="count-text">关注</div>
                    </router-link>
                    <!-- 粉丝 -->
                    <router-link
                      :to="{ name: 'followers' }"
                      :class="{ 'single-item-active': activeIndex === 1 }"
                      @mouseenter="activeIndex = 1"
                      @mouseleave="activeIndex = -1"
                      class="user-single-item"
                    >
                      <div class="count-num">{{ userInfo.followersNum }}</div>
                      <div class="count-text">粉丝</div>
                    </router-link>
                    <!-- 动态 -->
                    <router-link
                      :to="{ name: 'dynamic' }"
                      :class="{ 'single-item-active': activeIndex === 2 }"
                      @mouseenter="activeIndex = 2"
                      @mouseleave="activeIndex = -1"
                      class="user-single-item"
                    >
                      <div class="count-num">{{ userInfo.uploadCount }}</div>
                      <div class="count-text">动态</div>
                    </router-link>
                  </div>
                </div>
                <div class="links-list">
                  <div
                    class="links-item"
                    :class="{ 'item-activt': activeIndex === 3 }"
                    @mouseenter="activeIndex = 3"
                    @mouseleave="activeIndex = -1"
                  >
                    <router-link :to="{ name: 'personalCenter' }" class="single-link-item">
                      <div class="link-title">
                        <span>个人中心</span>
                        <SvgIcon :iconName="activeIndex === 3 ? 'icon-wode' : 'icon-wode2'" />
                      </div>
                    </router-link>
                  </div>
                  <div
                    class="links-item"
                    :class="{ 'item-activt': activeIndex === 4 }"
                    @mouseenter="activeIndex = 4"
                    @mouseleave="activeIndex = -1"
                  >
                    <router-link :to="{ name: 'myShare' }" class="single-link-item">
                      <div class="link-title">
                        <span>我的图集</span>
                        <SvgIcon
                          :iconName="
                            activeIndex === 4 ? 'icon-icon_tupian-mian' : 'icon-icon_tupian-xian'
                          "
                        />
                      </div>
                    </router-link>
                  </div>
                  <div
                    class="links-item"
                    :class="{ 'item-activt': activeIndex === 5 }"
                    @mouseenter="activeIndex = 5"
                    @mouseleave="activeIndex = -1"
                  >
                    <router-link :to="{ name: 'myCollect' }" class="single-link-item">
                      <div class="link-title">
                        <span>我的收藏</span>
                        <SvgIcon
                          :iconName="
                            activeIndex === 5 ? 'icon-icon_tuijian-mian' : 'icon-icon_tuijian-xian'
                          "
                        />
                      </div>
                    </router-link>
                  </div>
                  <div
                    class="links-item"
                    :class="{ 'item-activt': activeIndex === 6 }"
                    @mouseenter="activeIndex = 6"
                    @mouseleave="activeIndex = -1"
                  >
                    <router-link :to="{ name: 'myHistory' }" class="single-link-item">
                      <div class="link-title">
                        <span>浏览历史</span>
                        <SvgIcon
                          :iconName="
                            activeIndex === 6 ? 'icon-icon_shijian-mian' : 'icon-icon_shijian-xian'
                          "
                        />
                      </div>
                    </router-link>
                  </div>
                  <div class="split-line"></div>
                  <div
                    @click="logout"
                    class="logout-item"
                    :class="{ 'item-activt': activeIndex === 10 }"
                    @mouseenter="activeIndex = 10"
                    @mouseleave="activeIndex = -1"
                  >
                    <span>退出登录</span>
                    <SvgIcon iconName="icon-tuichu" />
                  </div>
                </div>
              </div>
            </transition>
            <!-- 头像 -->
            <div class="navbar-avatar-content" :class="showPopover ? 'selected-avatar' : ''">
              <router-link :to="{ name: 'personalCenter' }" class="navbar-anter-mycenter">
                <img class="avatar" :src="userInfo.userImg" />
              </router-link>
            </div>
          </div>

          <div class="navbar-right-login" v-else>
            <router-link class="login-enter" to="login">登录</router-link>
          </div>
        </div>
        <!-- 隐藏菜单 -->
        <div class="menu-toggle" @click="isMenuOpen = !isMenuOpen">其它</div>
      </div>
    </nav>
    <!-- 路由 -->
    <div class="router-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, reactive, computed, watch, onMounted } from 'vue'
import useCurrentInstance from './hooks/useCurrentInstance'
import Local from './utils/localStorage'
// import _ from 'lodash'
import { useUserStore } from './store/user'
const userStore = useUserStore()
const { proxy } = useCurrentInstance()
const navbarRef: Ref<HTMLElement | null> = ref(null)
const isMenuOpen = ref(false) // 菜单
const showPopover = ref(false) //
const isHover = ref(false)
const activeIndex = ref(-1)
const popoverHovered = ref(false)

let enterTimer: number | undefined
let leaveTimer: number | undefined
const userInfo = computed(() => userStore.userInfo)
const isLogin = computed(() => userStore.loginInfo.isLogin)
const handleMouseEnter = () => {
  clearTimeout(leaveTimer)
  enterTimer = setTimeout(() => {
    isHover.value = true
    showPopover.value = true
  }, 300)
}
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', newTheme)
}

const handleMouseLeave = () => {
  clearTimeout(enterTimer)
  leaveTimer = setTimeout(() => {
    isHover.value = false
    if (!popoverHovered.value) {
      showPopover.value = false
    }
  }, 300)
}
const popoverMouseEnter = () => {
  clearTimeout(leaveTimer)
  popoverHovered.value = true
  if (!isHover.value) {
    showPopover.value = true
  }
}
const popoverMouseLeave = () => {
  clearTimeout(enterTimer)
  popoverHovered.value = false
  if (!isHover.value) {
    showPopover.value = false
  }
}
const handleAvatarClick = () => {
  console.log('Avatar clicked')
}
// 验证登录状态
const userIsLogin = async () => {
  const result = await proxy.$http.userIsLogin()
  if (result.data) {
  } else {
  }
}
// 退出登录
const logout = () => {
  Local.removeItem('SHARE_USER_INFO')
  Local.removeItem('SHARE_TOKEN_INFO')
  window.location.href = '/home'
}

window.addEventListener('scroll', () => {
  // 获取当前滚动位置
  const scrollY = window.scrollY
  // 滚动窗口，隐藏头像导航
  if (showPopover.value) {
    showPopover.value = !showPopover.value
  }
})
onMounted(() => {
  // console.log(111)
})
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  @include bgc-color('bgc-color4', 0.77);
  .navbar {
    width: 100%;
    height: 80px;
    padding: 0 100px;
    position: sticky;
    backdrop-filter: blur(5px);
    @include border(2, solid, 'bgc-color3', bottom);
    transition:
      height 0.4s ease,
      transform 0.4s ease;
    z-index: 999;
    @include box-shadow(0px, 1px, 3px, 0px, 'shadow-color1');
    @include bgc-color('bgc-color1', 0.77);

    .navbar-container {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .navbar-left {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .logo {
          height: 90%;
          display: flex;
          align-items: center;
          justify-content: center;
          h2 {
            height: 80%;
            .logo-img {
              height: 100%;
            }
          }
        }

        .navbar-links {
          margin-left: 20px;
          display: flex;
          gap: 20px;

          a {
            @include color('font-color1');
            letter-spacing: 2px;
            font-size: 1.2rem;
            font-weight: bold;
            transition:
              color 0.3s ease,
              text-shadow 0.3s ease;
          }
          a:hover {
            @include color('font-color-activity1');
          }
          .link-active {
            @include color('font-color-activity1');
          }
        }
      }

      .navbar-right {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .navbar-avatar-container {
          height: 100%;
          position: relative;
          top: 0;
          left: 0;
          z-index: 999;

          .navbar-avatar-content {
            height: 100%;
            transform-origin: top right;
            transition: transform 0.3s ease;
            .navbar-anter-mycenter {
              height: 100%;
              min-width: 50px;
              display: flex;
              justify-content: center;
              align-items: center;
              .avatar {
                height: 65px;
                width: 65px;
                object-fit: cover;
                border-radius: 50%;
                border: 2px solid $border-color1;
              }
            }
          }
          .selected-avatar {
            transform: translate(-20px, 27px) scale(1.25);
          }
          .popover {
            position: absolute;
            top: calc(100% + 10px);
            left: calc(50% + -22px * 1.25);
            width: 250px;
            padding: 20px 10px 20px;
            background-color: $bgc-color1;
            border-radius: 10px;
            opacity: 1;
            transform: translateX(-50%);
            transition: opacity 0.3s ease-out;
            box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);

            .user-info {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding-top: 20px;
              .user-name {
                font-weight: bolder;
                font-size: 18px;
                margin-bottom: 10px;
              }
              .user-single-list {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 10px;
                .user-single-item {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  .count-num {
                    font-size: 18px;
                    color: $text-color2;
                  }
                  .count-text {
                    font-size: 14px;
                    color: $text-color3;
                  }
                }
                .single-item-active {
                  .count-text,
                  .count-num {
                    color: $text-color-activity1;
                  }
                }
              }
            }
            .links-list {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .links-item {
                width: 100%;
                padding: 5px 10px;
                overflow: hidden;
                .single-link-item {
                  .link-title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    span {
                      color: $text-color2;
                      font-size: 14px;
                    }
                  }
                }
              }
              .split-line {
                width: 100%;
                height: 1px;
                margin: 10px 0;
                background-color: $text-color1;
              }
              .logout-item {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 5px 10px;
                cursor: pointer;
                span {
                  color: $text-color2;
                  font-size: 14px;
                }
              }
              .item-activt {
                color: $text-color1;
                background-color: $bgc-color2;
                border-radius: 5px;
              }
            }
          }
          .popover-enter-from,
          .popover-leave-to {
            opacity: 0;
          }

          .popover-leave-from,
          .popover-enter-to {
            opacity: 1;
          }
        }
        .navbar-right-login {
          .login-enter {
            color: $text-color1;
            font-size: 16px;
            font-weight: 700;
            background-color: $btn-color1;
            padding: 10px;
            border-radius: 20px;
            border: 2px solid $border-color1;
            transition:
              color 0.35s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;

            &:hover {
              color: $text-color-activity1;
              background-color: $btn-color-select1;
              border-color: $border-color-activity1;
              box-shadow: 0 0 5px $text-color-activity1;
            }
          }
        }
      }
    }
    .menu-toggle {
      display: none;
      border: 2px solid $border-color1;
      border-right: none;
      border-radius: 0 0 25% 0;
      padding: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      /* 添加全局过渡 */

      &:hover {
        border-color: $border-color-activity1;
        box-shadow: 0 0 4px $text-color-activity1;
      }
    }
  }

  .navbar-hidden {
    /* 设置导航隐藏样式 */
    position: static;
  }
}
.el-popper-container-3490 {
  background-color: #123;
}
::v-deep .el-select-dropdown__item.is-selected {
  color: #e88;
  span {
    color: #e88;
  }
}
/* pc */
@media screen and (min-width: 960px) {
}

/* ipad */
@media screen and (max-width: 960px) {
  .app-container {
    .navbar {
      height: 70px;

      .navbar-container {
        justify-content: space-between;

        // .navbar-left {}

        // .navbar-right {}
      }
    }
  }
}
/* android */
@media screen and (max-width: 750px) {
  .app-container {
    .navbar {
      min-width: 400px;
      height: 50px;
      padding: 0 30px;

      .navbar-container {
        justify-content: space-between;

        .navbar-left {
          .navbar-links {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 50px;
            right: 0;
            width: 150px;
            padding: 10px;
            border-radius: 0 0 5% 5%;
            background-color: rgba($color: $bgc-color1, $alpha: 0.77);

            li {
              padding: 4px;
              border-radius: 5%;

              a {
                margin-bottom: 10px;
                padding: 2px 5px;
                border-radius: 5px;
                transition: background-color 0.3 ease;
              }
            }

            a:hover {
              background-color: $bgc-activity1;
            }

            &.show-menu {
              display: flex;
            }
          }
        }

        .navbar-right {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translate(-50%, 0);
        }

        .menu-toggle {
          display: block;
          border-width: 1px;
          padding: 2px;
        }
      }
    }
  }
}
</style>
