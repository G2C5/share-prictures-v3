<template>
  <div class="following-container">
    <div class="following-header">
      <div><p class="title">我的关注</p></div>
      <span class="center-num">关注：{{ pagination.total }}</span>
    </div>
    <!-- 用户列表 -->
    <div class="following-content" v-if="pagination.total">
      <ul class="following-list">
        <li
          @mouseleave="record.showInfo = -1"
          class="list-item"
          v-for="(f, i) in following"
          :key="f.userId"
        >
          <div class="list-item-left" @mouseenter="record.showInfo = i">
            <div class="user-left-left">
              <a href=""><img class="user-avatar" :src="f.userImg" alt="" /></a>
            </div>
            <div class="user-left-right">
              <a href="" class="name">{{ f.name }}</a>
              <p class="sign">{{ f.sign }}</p>
            </div>
          </div>
          <div class="list-item-right">
            <el-button @click="followUser(f.userId, i)" color="#e88" v-if="f.isFollowing"
              >已关注</el-button
            >
            <el-button @click="followUser(f.userId, i)" color="#e88" plain v-else>未关注</el-button>
          </div>
          <transition name="active">
            <div
              class="following-info"
              @mouseleave="record.showInfo = -1"
              v-show="record.showInfo === i"
            >
              <div class="info">
                <div class="info-content">
                  <span class="info-text">粉丝</span>
                  <span class="info-num">{{ f.followersNum }}</span>
                </div>
                <div class="info-content">
                  <span class="info-text">动态</span>
                  <span class="info-num">{{ f.uploadCount }}</span>
                </div>
              </div>
              <div class="action">
                <div class="action-item">
                  <el-button
                    @click="followUser(f.userId, i)"
                    color="#e88"
                    size="small"
                    v-if="f.isFollowing"
                    >已关注</el-button
                  >
                  <el-button @click="followUser(f.userId, i)" color="#e88" plain size="small" v-else
                    >未关注</el-button
                  >
                </div>
                <div class="action-item">
                  <el-button size="small" color="#e88" plain @click="openUserDynamic(f.userId)"
                    >去看看</el-button
                  >
                </div>
              </div>
            </div>
          </transition>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pagination-container" v-if="pagination.total">
      <PsPagination
        :total="pagination.total"
        v-model:page="pagination.page"
        v-model:size="pagination.pageSize"
        @change="handlePageChange"
      />
    </div>
    <div class="empty" v-if="pagination.total < 1">
      <span>没有关注任何人（─.─||）</span>
      <router-link class="go-rank" :to="{ name: 'rank' }">去逛逛?</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import useEnterUserInfo from '@/hooks/useEnterUserInfo'
const { openUserDynamic } = useEnterUserInfo() // 查看粉丝主页
const userStore = useUserStore()
const { proxy } = useCurrentInstance()
const router = useRouter()
const record = reactive({
  showInfo: -1
})
let enterTimer: number | undefined
let leaveTimer: number | undefined
const following = ref(
  [] as Array<{
    sign: string
    userImg: string
    name: string
    userId: string
    followersNum: number
    uploadCount: number
    isFollowing: number
  }>
) // 关注列表
const pagination = ref({
  page: 1,
  pageSize: 5,
  total: 0
}) // 分页
// 请求：关注列表
const handlePageChange = async () => {
  try {
    const result = await proxy.$http.getUserFollowing({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    following.value = result.data.followingList
    pagination.value.total = result.data.total
    console.log(result.data)
  } catch (error) {
    console.log(error)
  }
}
// 展示卡片
const handleMouseEnter = () => {
  clearTimeout(leaveTimer)
  enterTimer = setTimeout(() => {}, 300)
}
// 隐藏卡片
const handleMouseLeave = () => {
  clearTimeout(enterTimer)
  leaveTimer = setTimeout(() => {}, 300)
}

// 请求：关注用户
const followUser = async (authorId: string, index: number) => {
  try {
    let result
    const isfollowed = await isFollow(authorId)
    if (isfollowed) {
      // 请求取消关注
      result = await proxy.$http.unfollowing(authorId)
      following.value[index].isFollowing = 0
    } else {
      // 请求关注用户
      result = await proxy.$http.following(authorId)
      following.value[index].isFollowing = 1
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
  }
}
// 是否关注
const isFollow = async (authorId: string) => {
  try {
    const isfollow = await proxy.$http.isfollowing({ authorId })
    return isfollow.data
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  handlePageChange()
})
</script>

<style lang="scss" scoped>
.following-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 80vh;
  background-color: $bgc-color1;
  .following-header {
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
  .following-content {
    width: 100%;
    .following-list {
      width: 100%;
      padding: 0 50px;
      display: flex;
      flex-direction: column;

      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-bottom: 5px;
        padding: 20px 10px;
        border-bottom: 1px solid $text-color3;

        .list-item-left {
          display: flex;
          align-items: center;
          gap: 20px;
          .user-left-left {
            .user-avatar {
              width: 70px;
              height: 70px;
              border-radius: 50%;
            }
          }
          .user-left-right {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .name {
              color: #0ee;
            }
            .sign {
              font-size: 14px;
              color: $text-color3;
            }
          }
        }
        .list-item-right {
        }
        .following-info {
          width: 200px;
          padding: 20px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          position: absolute;
          bottom: 50%;
          left: 12%;
          transform: translateY(50%);
          background-color: $bgc-color2;
          border-radius: 10px;
          transition: opacity 0.3s ease;

          .info {
            display: flex;
            gap: 10px;
            .info-content {
              display: flex;
              gap: 5px;
              .info-text {
                font-size: 14px;
              }
              .info-num {
                font-size: 14px;
              }
            }
          }
          .action {
            display: flex;
            gap: 10px;
            .action-item {
            }
          }
        }
        .active-enter-to,
        .active-leave-from {
          opacity: 1;
        }

        .active-enter-from,
        .active-leave-to {
          opacity: 0;
        }
      }
    }
  }
  .pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
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
    .go-rank {
      color: $text-color-activity1;
    }
  }
}
</style>
