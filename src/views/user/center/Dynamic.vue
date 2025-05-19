<template>
  <div class="user-center-container">
    <div class="user-center-header">
      <div><p class="title">我的动态</p></div>
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
                    <div class="edit-item" @click="delDynamic(item._id, index)">
                      <SvgIcon iconName="icon-icon_shanchu-xian" />
                      <span>删除</span>
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
</template>

<script setup lang="ts">
import _ from 'lodash'
import { reactive, onMounted, ref, onBeforeUnmount, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { MyDynamic } from '../../types/types'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import usePicture from '@/hooks/usePicture'
const { openPictureDetail } = usePicture()
const userStore = useUserStore()
const route = useRoute()
const { proxy } = useCurrentInstance()
const myDynamic = ref([] as MyDynamic[])
const pagination = reactive({ page: 1, pageSize: 2 })
const total = ref()
const showMenu = ref() //菜单
let messageInstance: any | null = null
// 获取动态
const getMyDynamic = async () => {
  try {
    const result = await proxy.$http.getMyDynamic(pagination)
    pagination.page++
    // 保存
    myDynamic.value = [...myDynamic.value, ...result.data.dynamic]
    total.value = result.data.total
  } catch (error) {
    console.log(error)
  }
}
// 是否还有数据
const isNoMoreData = computed(() => {
  console.log(myDynamic.value.length, total.value)
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
// 删除动态
const delDynamic = async (imageId: string, index: number) => {
  try {
    const result = await proxy.$http.delShareImage(imageId)
    if (result.code === 200) {
      // 更新用户信息
      userStore.initUserInfo({ data: result.data })
      myDynamic.value.splice(index, 1)
      if (messageInstance) {
        messageInstance.close()
      }
      messageInstance = ElMessage.success('删除成功')
    }
  } catch (error) {
    console.log(error)
  }
}

// 触底事件
const { isBottom } = useInfiniteScroll({ threshold: 150 })

const unwatch = watch(isBottom, (newIsBottom) => {
  if (newIsBottom && !isNoMoreData.value) {
    getMyDynamic()
  }
})
onMounted(() => {
  getMyDynamic()
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  unwatch()
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style lang="scss" scoped>
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
</style>
