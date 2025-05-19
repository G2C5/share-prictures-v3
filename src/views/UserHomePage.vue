<template>
  <div class="container">
    <div class="wrapper">
      <!-- 导航 -->
      <div class="user-container">
        <div class="user-action">
          <!-- 用户头像 -->
          <div class="user-info">
            <img class="user-avatar" :src="showInfo.userImg" alt="头像" />
            <span class="user-name">{{ showInfo.name }}</span>
            <el-button
              :loading="recordType.isloading"
              @click="followUser"
              v-if="recordType.isFollowing"
              class="follow-btn"
              >已关注</el-button
            >
            <el-button :loading="recordType.isloading" @click="followUser" v-else class="follow-btn"
              >未关注</el-button
            >
          </div>

          <div class="user-action-list">
            <el-input class="search-dynamic"></el-input>
          </div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="user-action-content">
        <!-- 左边：作者 -->
        <div class="user-center-nav">
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
        <!-- 右边：动态 -->
        <div class="user-center-container">
          <div class="user-center-header">
            <div><p class="title">个人动态</p></div>
            <span class="center-num">动态：{{ myDynamic.length }}</span>
          </div>
          <div class="user-share-list" v-if="myDynamic.length">
            <div class="share-item" v-for="(item, index) in myDynamic" :key="item._id">
              <div class="share-picture-content">
                <div class="share-picture">
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="item.imageUrl[0]"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="item.imageUrl"
                    :initial-index="0"
                    fit="cover"
                  />
                </div>
                <div></div>
              </div>
              <div class="share-picture-info">
                <div class="picture-top">
                  <div class="picture-titke">
                    <h3>{{ item.title }}</h3>
                    <div class="picture-titke-left" @click="isShowMenu(index)">
                      <SvgIcon iconName="icon-more0" />
                      <transition name="fade">
                        <div v-if="showMenu === index" class="edit">
                          <div class="edit-item" @click="openPictureDetail(item._id)">
                            <SvgIcon iconName="icon-chakan" />
                            <span>查看</span>
                          </div>
                        </div>
                      </transition>
                    </div>
                  </div>
                  <div class="picture-tags">
                    <SpLabel :lbData="item.tags"></SpLabel>
                  </div>
                </div>

                <div class="picture-center">
                  <div class="picture-center-discription">
                    <p>{{ item.description }}</p>
                  </div>
                  <div class="picture-center-data">
                    <div class="info">
                      <div class="info-item">
                        <SvgIcon iconName="icon-views1" />
                        <span class="info-item-num">{{ item.views }}</span>
                      </div>
                      <div class="info-item">
                        <SvgIcon iconName="icon-like1" />
                        <span class="info-item-num">{{ item.like }}</span>
                      </div>
                      <div class="info-item">
                        <SvgIcon iconName="icon-collect1" />
                        <span class="info-item-num">{{ item.collect }}</span>
                      </div>
                    </div>
                    <div class="time">{{ item.date }}</div>
                  </div>
                </div>

                <div class="picture-bottom">
                  <div>
                    <div class="share-levmsg-top">
                      <h3>图片留言</h3>
                      <div>
                        <el-button @click="openPictureDetail(item._id)" link>查看详情</el-button>
                      </div>
                    </div>
                    <ul v-if="item.topLevMsgs.length > 0">
                      <li v-for="(levmsg, index) in item.topLevMsgs" class="share-levmsg-item">
                        <span class="lev-user">{{ levmsg.name }}</span>
                        <span class="lev-text">{{ levmsg.levmsg }}</span>
                        <SvgIcon iconName="icon-like1" />
                        <span class="lev-num">{{ levmsg.like }}</span>
                      </li>
                    </ul>
                    <div v-else style="text-align: center; color: #888">还没有留言</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="more" v-if="myDynamic.length">
              <span v-if="isNoMoreData">没有更多了</span>
              <span v-else>正在加载......</span>
            </div>
          </div>
          <div class="empty" v-if="!myDynamic.length">
            <span>没有任何动态━━∑(￣□￣*|||━━</span>
            <router-link class="go-share" :to="{ name: 'share' }">去分享?</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <JoinUs v-model:visible="recordType.visible" />
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import useCurrentInstance from '../hooks/useCurrentInstance'
import type { FollowersInfo, MyDynamic } from '@/views/types/types'
import _ from 'lodash'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import usePicture from '@/hooks/usePicture'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const { openPictureDetail } = usePicture()
const route = useRoute()
const { proxy } = useCurrentInstance()
const myDynamic = ref([] as MyDynamic[]) // 个人动态数据
const pagination = reactive({ page: 1, pageSize: 2 })
const total = ref()
const showMenu = ref() //菜单
const showInfo = ref({} as FollowersInfo) // 个人信息
const recordType = reactive({
  isloading: false, // 请求中
  isFollowing: false, // 是否关注用户
  visible: false // 未登录弹窗
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
// 获取动态
const getMyDynamic = async () => {
  try {
    const userId = route.query.userId
    const result = await proxy.$http.getAuthorDynamic({
      userId,
      ...pagination
    })
    pagination.page++
    // 保存
    myDynamic.value = [...myDynamic.value, ...result.data.dynamic]
    total.value = result.data.total
  } catch (error) {
    console.log(error)
  }
}
// 请求，判断是否关注
const isFollow = async () => {
  try {
    const authorId = route.query.userId
    const isfollow = await proxy.$http.isfollowing({ authorId })
    recordType.isFollowing = isfollow.data
    return isfollow.data
  } catch (error) {
    console.log(error)
  }
}
// 请求：关注用户
const followUser = async () => {
  try {
    if (!requserPass()) return
    recordType.isloading = true
    let result
    const authorId = route.query.userId
    const isfollowed = await isFollow()
    if (isfollowed) {
      result = await proxy.$http.unfollowing(authorId)
      recordType.isFollowing = false
    } else {
      result = await proxy.$http.following(authorId)
      recordType.isFollowing = true
    }
    // 更新用户信息
    userStore.initUserInfo({ data: result.data })
    ElMessage({
      showClose: true,
      message: result.message,
      type: 'success',
      duration: 2000
    })
  } catch (error) {
    console.log(error)
  } finally {
    recordType.isloading = false
  }
}
// 判断 登录|未登录 用户的请求放行（关注、点赞...）
const requserPass = () => {
  const isLogin = userStore.loginInfo.isLogin
  if (!isLogin) {
    console.log(1)
    recordType.visible = true
    return false
  }
  return true
}
// 是否还有数据
const isNoMoreData = computed(() => {
  if (myDynamic.value.length === total.value) {
    return true
  } else {
    return false
  }
})
// 点击隐藏菜单
const handleOutsideClick = _.throttle((event: MouseEvent) => {
  const target = event.target as HTMLElement
  // 如果点击事件不在菜单以及菜单的父元素内部，则隐藏菜单
  if (!target.closest('.picture-titke-left') && showMenu.value !== null) {
    showMenu.value = null
  }
}, 500)
// 菜单显示
const isShowMenu = _.debounce((index: number) => {
  showMenu.value === index ? (showMenu.value = -1) : (showMenu.value = index)
}, 300)

// 触底事件
const { isBottom } = useInfiniteScroll({ threshold: 150 })

const unwatch = watch(isBottom, (newIsBottom) => {
  if (newIsBottom && !isNoMoreData.value) {
    getMyDynamic()
  }
})
onMounted(() => {
  if (userStore.loginInfo.isLogin) isFollow()
  getUserInfo()
  getMyDynamic()
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  unwatch()
  document.removeEventListener('click', handleOutsideClick)
})
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
          gap: 15px;
          .user-avatar {
            width: 60px;
            border-radius: 50%;
          }
          .user-name {
            font-size: 18px;
            font-weight: bolder;
          }
          .follow-btn {
            margin-left: 10px;
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
          .search-dynamic {
            width: 250px;
            margin-right: 20px;
          }
        }
      }
    }
    .user-action-content {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      width: 100%;
      height: 100%;
      min-height: 80vh;
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
      .user-center-container {
        display: flex;
        flex-direction: column;
        min-height: 80vh;
        width: 100%;
        height: 100%;
        background-color: $bgc-color1;
        .user-center-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 50px;
          padding: 0 20px;
          background-color: $bgc-color2;
          .title {
            font-weight: bolder;
          }
          .center-num {
            color: $text-color3;
            text-align: center;
            margin-right: 10px;
          }
        }
        .user-share-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 50px;
          .share-item {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            background-color: $bgc-color2;

            .share-picture-content {
              .share-picture {
                width: 400px;
                height: 300px;
              }
            }
            .share-picture-info {
              margin-left: 10px;
              flex-grow: 1;
              padding: 5px;
              display: flex;
              flex-direction: column;
              .picture-top {
                display: flex;
                flex-direction: column;
                .picture-titke {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;

                  .picture-titke-left {
                    position: relative;
                    padding-left: 20px;
                    .edit {
                      position: absolute;
                      top: 0;
                      right: 30px;
                      padding: 10px;
                      display: flex;
                      flex-direction: column;
                      width: 90px;
                      gap: 15px;

                      background-color: $bgc-color1;
                      box-shadow: 0 0 2px #000;
                      border-radius: 5px;
                      cursor: pointer;
                      transition: opacity 0.3s ease;
                      .edit-item {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 5px;
                      }
                      .edit-item:hover {
                        background-color: $bgc-color2;
                        border-radius: 4px;
                        color: $text-color-activity1;
                      }
                    }
                    .fade-enter-to,
                    .fade-leave-from {
                      opacity: 1;
                    }
                    .fade-enter-from,
                    .fade-leave-to {
                      opacity: 0;
                    }
                  }
                }
                .picture-tags {
                  margin: 5px;
                  width: 100%;
                }
              }
              .picture-center {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 0px 10px 5px;
                background-color: $bgc-color1;
                border-radius: 10px;
                .picture-center-discription {
                  padding: 10px 2px;
                }
                .picture-center-data {
                  align-self: flex-end;
                  .info {
                    display: flex;
                    gap: 10px;
                    .info-item-num {
                      margin-left: 5px;
                    }
                  }
                  .time {
                    margin: 10px 0;
                    text-align: right;
                  }
                }
              }
              .picture-bottom {
                // background-color: orange;
                .share-levmsg-top {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin: 10px 0;
                  font-size: 16px;
                }
                .share-levmsg-item {
                  padding: 0 10px;
                  .lev-user {
                    font-weight: bolder;
                    font-size: 16px;
                  }
                  .lev-text {
                    padding: 10px;
                    font-size: 14px;
                  }
                }
              }
            }
          }
          .more {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 50px;
          }
        }
        .empty {
          width: 100%;
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          .go-share {
            color: $text-color-activity1;
          }
        }
      }
      .add-picture {
        padding: 20px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
      }
      .add-picture:hover {
        color: $text-dark-activity1;
        font-size: 16px;
      }
    }
  }
}
</style>
