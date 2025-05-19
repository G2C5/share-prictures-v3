<template>
  <div class="detail-container">
    <div class="wrapper">
      <!-- 上半：图片&作者 -->
      <div class="detail-top">
        <!-- 上左：图片 -->
        <div class="detail-left">
          <el-image style="height: 100%" @click="toggleSidebar" lazy :src="currentUrl">
            <template #placeholder>
              <div class="image-slot">Loading<span class="dot">...</span></div>
            </template>
          </el-image>
          <!-- 侧边的缩略图列表 -->
          <div
            v-if="urls && urls.length > 1"
            class="sidebar"
            :class="{ collapsed: recordType.isSidebarCollapsed }"
          >
            <el-image
              class="sidebar-img"
              style="height: 100px"
              v-for="(i, index) in urls"
              :src="i"
              :key="index"
              @click="showImage(index)"
            ></el-image>
          </div>
        </div>
        <!-- 上右：作者-->
        <div class="detail-right">
          <!-- 作者 -->
          <div class="detail-right-top">
            <div class="author-info">
              <div @click="openUserDynamic(picturData.imageDetail.userId)" class="author-img">
                <img class="auimg" :src="picturData.imageDetail.userImg" />
              </div>
              <div class="author-msg">
                <div class="auname">
                  <a>{{ picturData.imageDetail.name }}</a>
                </div>
                <span class="auid" @click="getDetail">ID:{{ picturData.imageDetail.userId }}</span>
              </div>
            </div>
            <div class="user-action" v-if="showFollowBtn">
              <el-button type="" @click="followUser" :loading="recordType.isloading" round>
                <span style="width: 50px" v-show="recordType.record.isFollowing">已关注</span>
                <span style="width: 50px" v-show="!recordType.record.isFollowing">+关注</span>
              </el-button>
            </div>
          </div>
          <!-- 其它作品 -->
          <div class="detail-right-bottom">
            <p class="other-works">其它作品</p>
            <div
              class="other-works-item"
              v-if="picturData.otherImage && picturData.otherImage.length > 0"
              v-for="(o, index) in picturData.otherImage"
              :key="o._id"
            >
              <div class="other-works-img">
                <el-image
                  fit="cover"
                  style="width: 150px; height: 120px"
                  @click="openPictureDetail(o._id)"
                  :src="o.imageUrl[0].url"
                  alt="图片"
                />
              </div>
              <div class="other-works-container">
                <div class="other-works-info">
                  <h4 class="other-works-title">{{ o.title }}</h4>
                  <p class="other-works-description">{{ o.description }}</p>
                </div>
                <div class="other-works-other">
                  <!-- 浏览 -->
                  <div class="action-container">
                    <SvgIcon iconName="icon-icon_liulan-xian"></SvgIcon>
                    <span class="svg-item no-select">{{ o.views }}</span>
                  </div>
                  <!-- 点赞 -->
                  <div class="action-container">
                    <SvgIcon iconName="icon-icon_dianzan-xian"></SvgIcon>
                    <span class="svg-item no-select">{{ o.like }}</span>
                  </div>
                  <!-- 收藏 -->
                  <div class="action-container">
                    <SvgIcon iconName="icon-icon_shoucang-xian"></SvgIcon>
                    <span class="svg-item no-select">{{ o.collect }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 下半:图片信息 -->
      <div class="detail-bottom">
        <div class="detail-content">
          <div class="user-action">
            <!-- 浏览 -->
            <div class="action-container">
              <SvgIcon class="icon-size1" iconName="icon-icon_liulan-xian"></SvgIcon>
              <span class="svg-item">{{ picturData.imageDetail.views }}</span>
            </div>
            <!-- 点赞 -->
            <div class="action-container">
              <SvgIcon
                :color="isLikeImage"
                iconName="icon-icon_dianzan-mian"
                class="icon-size1"
                @click="likeImage(picturData.imageDetail._id)"
              ></SvgIcon>
              <span class="svg-item">{{ picturData.imageDetail.like }}</span>
            </div>
            <!-- 收藏 -->
            <div class="action-container">
              <SvgIcon
                :color="isCollectImage"
                class="icon-size1"
                iconName="icon-icon_shoucang-mian"
                @click="collectImage(picturData.imageDetail._id)"
              ></SvgIcon>
              <span class="svg-item">{{ picturData.imageDetail.collect }}</span>
            </div>
          </div>
          <div class="detail-title">
            <h2>{{ picturData.imageDetail.title }}</h2>
            <span>{{ picturData.imageDetail.date }}</span>
          </div>

          <!-- 标签 -->
          <div>
            <SpLabel :lbData="picturData.imageDetail.tags" />
          </div>
          <!-- 简介 -->
          <div class="detail-msg">
            <span>{{ picturData.imageDetail.description }}</span>
          </div>
        </div>
      </div>
      <!-- 留言区域 -->
      <div class="lvmsg-list" ref="lvmsgRef">
        <!-- 留言标栏 -->
        <div class="lvmsg-header" ref="lvmsgHeaderRef">
          <div class="lvmsg-title">
            <h2>留言</h2>
            <SvgIcon iconName="icon-icon_xie1"></SvgIcon>
          </div>
          <!-- 评论排序 -->
          <div class="lvmsg-sort">
            <span class="sort-selected">默认</span>
            <span>|</span>
            <span>最新</span>
          </div>
        </div>
        <!-- 留言入口 1 -->
        <div class="user-liuyan">
          <div class="levmsg-enter">
            <el-input
              ref="inputOneRef"
              type="textarea"
              v-model="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              placeholder="留言(200字以内)"
              resize="none"
              maxlength="200"
              @focus="checkInputFocus(1)"
            />
          </div>
          <div class="levmsg-submit" :class="{ expanded: recordType.showBtn === 1 }">
            <el-button
              :loading="recordType.isloading"
              :disabled="!textarea.trim()"
              class="submit-btn"
              @click="submitLevMsg"
              >留言</el-button
            >
          </div>
        </div>
        <!-- 留言内容 -->
        <ul v-if="picturData.levmsgs.length">
          <li v-for="(levmsg, index) in picturData.levmsgs" :key="levmsg._id">
            <div class="lvmsg-item">
              <!-- 留言的用户信息 -->
              <div class="lvmsg-user">
                <div class="lvmsg-user-left">
                  <img class="lvmsg-avatar" :src="levmsg.userImg" alt="" />
                  <div class="lvmsg-username">
                    <a href="">{{ levmsg.name }}</a>
                  </div>
                </div>
                <!-- 编辑|删除留言 -->
                <div class="targe">
                  <span class="lvmsg-date">{{ levmsg.date }}</span>
                  <div style="display: inline-block">
                    <SvgIcon
                      v-if="levmsg.isMyLevMsg"
                      @click="recordType.levmsgPopupIndex = levmsg._id"
                      iconName="icon-edit"
                    ></SvgIcon>
                    <!-- <SvgIcon
                      v-else
                      @click="recordType.levmsgPopupIndex = levmsg._id"
                      iconName="icon-more0"
                    ></SvgIcon> -->
                  </div>
                </div>
              </div>
              <!-- 用户的留言内容 -->
              <div class="lvmsg-container">
                <!-- 点赞留言 -->
                <span class="lvmsg-content">
                  {{ levmsg.levmsg }}
                </span>
                <span
                  ><SvgIcon
                    @click="likeLevMsg(levmsg._id, index)"
                    :iconName="!levmsg.isLike ? 'icon-icon_dianzan-xian' : 'icon-icon_dianzan-mian'"
                  ></SvgIcon>
                  <span class="iconfont icon-dianzan_kuai">{{ levmsg.like }}</span></span
                >
              </div>
            </div>
            <!-- 弹窗 -->
            <transition name="popover">
              <div class="popup-levmsg" v-if="recordType.levmsgPopupIndex == levmsg._id">
                <div v-if="levmsg.isMyLevMsg" @click="delMyLevmsg(levmsg._id)">
                  删除<SvgIcon iconName="icon-icon_shanchu-xian"></SvgIcon>
                </div>
                <!-- <div v-if=else>
                  举报<SvgIcon iconName="icon-icon_jubao-xian"></SvgIcon>
                </div> -->
              </div>
            </transition>
          </li>
        </ul>
        <!-- 没有留言 -->
        <div class="empty">
          <div class="empty-info" v-if="pagination.total === 0">
            <span>没有任何留言━━∑(￣□￣*|||━━</span>
            <el-button @click="enterlevmsg" link>[去留言]</el-button>
          </div>
          <div class="empty-loading" v-else>
            <span v-show="recordType.isLoadingLevmsg">正在翻找...</span>
            <span v-show="pagination.total === picturData.levmsgs.length">没有更多了</span>
          </div>
        </div>
        <!-- 留言入口 2 -->
        <transition name="liuyan">
          <div v-show="recordType.showLevmsgTextarea" class="user-liuyan user-liuyan-float">
            <!-- 留言输入 -->
            <div class="levmsg-enter">
              <el-input
                ref="inputTwoRef"
                type="textarea"
                v-model="textarea"
                :autosize="{ minRows: 3, maxRows: 4 }"
                placeholder="留言(200字以内)"
                resize="none"
                maxlength="200"
                @focus="checkInputFocus(2)"
              />
            </div>
            <!-- 留言提交 -->
            <div class="levmsg-submit" :class="{ expanded: recordType.showBtn === 2 }">
              <el-button
                :loading="recordType.isloading"
                :disabled="!textarea.trim()"
                class="submit-btn"
                @click="submitLevMsg"
                >留言</el-button
              >
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <JoinUs v-model:visible="recordType.visible" />
</template>

<script setup lang="ts">
import type {
  ImageDetail,
  PictureRecord,
  ImageUrl,
  LevMsgDetail,
  OtherImageData
} from './types/types'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import _ from 'lodash'
import moment from 'moment'
import Local from '@/utils/localStorage'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import usePicture from '@/hooks/usePicture'
import useEnterUserInfo from '@/hooks/useEnterUserInfo'
const { openUserDynamic } = useEnterUserInfo() // 查看粉丝主页
const { openPictureDetail } = usePicture()
const { proxy } = useCurrentInstance()
const route = useRoute()
const userStore = useUserStore()
const lvmsgRef = ref<HTMLDivElement | null>(null)
const inputOneRef = ref<HTMLInputElement | null>(null)
const inputTwoRef = ref<HTMLInputElement | null>(null)
const lvmsgHeaderRef = ref<HTMLDivElement | null>(null)
const urls = ref<string[]>() // 全部缩略图路径
const currentUrl = ref<string>('') // 当前的展示图片
const picturData = reactive({
  levmsgs: [] as LevMsgDetail[], //留言列表
  imageDetail: {} as ImageDetail, // 图片详情
  otherImage: [] as OtherImageData[] //作者作品推荐
}) // 图片信息
const pagination = reactive<{ page: number; pageSize: number; total: number }>({
  page: 1, // 当前页面
  pageSize: 2, // 每页展示条数
  total: 0 // 总条数
})
const textarea = ref('') // 留言
const timer = ref() //观看延时记录

// 标记
const recordType = reactive({
  isSidebarCollapsed: true, // 展示用户上传多张图片的缩略预览
  levmsgPopupIndex: '', // 用户留言操作展开的弹窗序列
  record: {} as PictureRecord, // 图片点赞、收藏、关注记录
  isloading: false, // 控制按钮转圈圈
  showBtn: 0, // 留言按钮0隐藏，1展示留言入口1按钮，2展示留言入口2按钮
  showLevmsgTextarea: false, // 当留言输入框不在视口，展现第二个输入框
  isLoadingLevmsg: false, // 是否加载留言
  visible: false
})

// 计算：样式，是否点赞图片
const isLikeImage = computed(() => {
  return recordType.record.isLike ? '#0ee' : '#3a3a3a'
})
// 计算：样式，是否收藏图片
const isCollectImage = computed(() => {
  return recordType.record.isCollect ? '#0ee' : '#3a3a3a'
})
// 计算：关注按钮的渲染
const showFollowBtn = computed(() => {
  if (userStore.userInfo._id === picturData.imageDetail.userId) {
    return false
  }
  return true
})
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
// 输出框获取焦点：展示留言提价按钮
const checkInputFocus = (index: number) => {
  recordType.showBtn = index
}
// 点击其它区域，隐藏留言提价按钮
const checkInputBlur = () => {
  // 有内容不隐藏提交按钮
  if (!textarea.value.trim()) {
    recordType.showBtn = 0
  }
}

// 请求：图片详情
const getDetail = async () => {
  try {
    const imageId = route.query.imageId
    const result = await proxy.$http.getImageDetail(imageId)
    picturData.imageDetail = result.data // 保存图片详细信息
    urls.value = result.data.imageUrl.map((item: ImageUrl) => item.url) // 所有图片
    currentUrl.value = urls.value ? urls.value[0] : '' // 当前图片
    setLocalHistory() // 历史记录
  } catch (error) {
    console.log(error)
  }
}
// 请求：留言
const getLevmsg = async () => {
  try {
    const imageId = picturData.imageDetail._id
    const result = await proxy.$http.viewLevMsg({
      page: pagination.page,
      pageSize: pagination.pageSize,
      imageId: imageId
    })
    picturData.levmsgs.push(...result.data.LevMsgs)
    pagination.total = result.data.total
    pagination.page++
    if (pagination.total <= picturData.levmsgs.length) {
      document.removeEventListener('scroll', levmsgScoll)
    }
  } catch (error) {
    console.log(error)
  }
}
// 请求：提交我的留言
const submitLevMsg = async () => {
  try {
    if (!requserPass()) return
    recordType.isloading = true
    const imageId = picturData.imageDetail._id
    const result = await proxy.$http.addLevMsg({ imageId, levmsg: textarea.value })
    const page = Math.ceil(pagination.total / pagination.pageSize)
    pagination.page = page // 最后一页
    picturData.levmsgs.push({
      name: userStore.userInfo?.name,
      userImg: userStore.userInfo?.userImg,
      isMyLevMsg: 1,
      ...result.data
    }) // 更新数据
    pagination.total += 1 // 留言总数加一
    textarea.value = '' // 清空输入
  } catch (error) {
    console.log(error)
  } finally {
    recordType.isloading = false
  }
}
// 请求：删除我的留言
const delMyLevmsg = async (id: string) => {
  try {
    const result = await proxy.$http.delLevMsg(id) // 删除请求
    pagination.total -= 1 // 留言总条数-1
    picturData.levmsgs = picturData.levmsgs.filter((levmsg) => levmsg._id !== id) // 删除当前留言
  } catch (error) {
    console.log(error)
  }
}
// 请求：点赞留言
const likeLevMsg = _.debounce(async (levMsgId: string, index: number) => {
  try {
    if (!requserPass()) return
    const result = await proxy.$http.likeLevMsg(levMsgId)
    picturData.levmsgs[index].isLike = result.data.isLike
    if (result.data.isLike) {
      picturData.levmsgs[index].like += 1
    } else {
      picturData.levmsgs[index].like -= 1
    }
  } catch (error) {
    console.log(error)
  }
}, 500)
// 请求：其它作品
const getOtherImage = async () => {
  try {
    const { userId, _id } = picturData.imageDetail
    const result = await proxy.$http.getOtherImage({ imageId: _id, userId })
    picturData.otherImage = result.data
  } catch (error) {
    console.log(error)
  }
}
// 请求，判断是否关注
const isFollow = async () => {
  try {
    const authorId = picturData.imageDetail.userId
    const isfollow = await proxy.$http.isfollowing({ authorId })
    recordType.record.isFollowing = isfollow.data
    return isfollow.data
  } catch (error) {
    console.log(error)
  }
}
// 请求：关注用户
const followUser = _.debounce(async () => {
  try {
    if (!requserPass()) return
    recordType.isloading = true
    let result
    const authorId = picturData.imageDetail.userId
    const isfollowed = await isFollow()
    if (isfollowed) {
      result = await proxy.$http.unfollowing(authorId)
      recordType.record.isFollowing = false
    } else {
      result = await proxy.$http.following(authorId)
      recordType.record.isFollowing = true
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
}, 200)
// 请求：点赞图片
const likeImage = _.throttle(async (id: string) => {
  try {
    if (!requserPass()) return
    const result = await proxy.$http.likeShareImage(id)
    recordType.record.isLike = result.data.isLike
    picturData.imageDetail.like = result.data.like
  } catch (error) {
    console.log(error)
  }
}, 300)
// 请求：收藏图片
const collectImage = _.throttle(async (id: string) => {
  try {
    if (!requserPass()) return
    const result = await proxy.$http.collectShareImage(id)
    recordType.record.isCollect = result.data.isCollect
    picturData.imageDetail.collect = result.data.collect
  } catch (error) {
    console.log(error)
  }
}, 300)
// 请求：收藏、点赞图片状态
const getPictureRecord = async () => {
  try {
    const imageId = route.query.imageId || picturData.imageDetail._id
    const result = await proxy.$http.isRecordPicture(imageId)
    recordType.record.isLike = result.data.isLike
    recordType.record.isCollect = result.data.isCollect
  } catch (error) {
    console.log(error)
  }
}
// 请求：记录查看次数
const viewImage = async () => {
  try {
    await proxy.$http.watchRecord(picturData.imageDetail._id)
  } catch (error) {
    console.log(error)
  }
}
// 展示的图片的index
const showImage = (index: number) => {
  currentUrl.value = urls.value ? urls.value[index] : ''
  recordType.isSidebarCollapsed = !recordType.isSidebarCollapsed
}
// 是否展示缩略图
const toggleSidebar = () => {
  recordType.isSidebarCollapsed = !recordType.isSidebarCollapsed
}
// 历史记录
const setLocalHistory = () => {
  try {
    const formattedDate = moment().format('YYYY-MM-DD HH:mm')
    const historyItem = {
      imageUrl: currentUrl.value,
      imageId: picturData.imageDetail._id,
      title: picturData.imageDetail.title,
      date: formattedDate,
      name: picturData.imageDetail.name,
      userId: picturData.imageDetail.userId
    }

    let data = Local.getItem<{ history: any[] }>('SHARE_HISTORY') || { history: [] }

    // 遍历历史记录数组，查找是否已存在相同的 imageId
    const index = data.history.findIndex((item: any) => item.imageId === historyItem.imageId)
    if (index !== -1) {
      // 如果存在相同的 imageId，则先删除旧记录
      data.history.splice(index, 1)
    }
    // 如果历史记录数组已经达到了20个记录，则删除最旧的记录
    if (data.history.length >= 20) {
      data.history.pop()
    }
    // 添加新记录
    data.history.unshift(historyItem)

    // 更新本地存储的历史记录数据
    Local.setItem('SHARE_HISTORY', data)
  } catch (error) {
    console.log(error)
  }
}
// 去留言
const enterlevmsg = () => {
  recordType.showBtn = 1
  inputOneRef.value?.focus()
}
// 留言弹出操作框的隐藏
const handleClickOutside = _.throttle((event: Event) => {
  // 获取点击的元素
  const target = event.target as HTMLElement
  // 如果点击的元素不是弹窗内部，则隐藏弹窗
  if (!target.closest('.targe') && !target.closest('.popup-levmsg')) {
    recordType.levmsgPopupIndex = '' // 用户留言弹框空序号隐藏所有
  }
  if (
    !target.closest('.user-liuyan') &&
    !target.closest('.submit-btn') &&
    !target.closest('.empty-info')
  ) {
    checkInputBlur() // 隐藏提交留言按钮
  }
}, 300)

// 留言区距离顶部的距离事件
const calculateDistance = _.throttle(() => {
  if (lvmsgRef.value) {
    const targetTop = lvmsgRef.value.getBoundingClientRect().top
    if (targetTop < -150) {
      checkInputBlur() // 隐藏提交留言按钮
      inputOneRef.value?.blur() // 输入框1失去焦点
      recordType.showLevmsgTextarea = true // 展现输入框2
    } else {
      recordType.showLevmsgTextarea = false // 隐藏输入框
      inputTwoRef.value?.blur() // 输入框2失去焦点
    }
  }
}, 300)

//留言加载事件
const levmsgScoll = _.throttle(() => {
  try {
    // 获取页面滚动的高度
    const scrollHeight = document.documentElement.scrollHeight
    // 获取视口的高度
    const clientHeight = document.documentElement.clientHeight
    // 获取页面滚动的距离
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    // 当页面滚动到距离底部还有一定距离时，加载新数据
    if (scrollHeight - clientHeight - scrollTop < 150 && !recordType.isLoadingLevmsg) {
      // 开始加载数据
      recordType.isLoadingLevmsg = true
      // 加载留言
      getLevmsg().then(() => {
        // 加载数据完成后，将 isLoading 设置为 false
        recordType.isLoadingLevmsg = false
      })
    }
  } catch (error) {}
}, 300)

// 初始化数据
const initData = async () => {
  const isLogin = userStore.loginInfo.isLogin
  // 已登录
  if (isLogin) {
    await getDetail() // 获取图片详情
    getLevmsg() // 获取图片留言
    getOtherImage() // 作者其它作品
    isFollow() // 是否关注
    getPictureRecord() //点赞、收藏记录
    viewImage() // 浏览图片记录
  } else {
    // 未登录
    await getDetail() // 获取图片详情
    getOtherImage() // 作者其它作品
    getLevmsg() // 获取图片留言
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('scroll', calculateDistance)
  document.addEventListener('scroll', levmsgScoll)
  initData()
})

onUnmounted(() => {
  clearTimeout(timer.value)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('scroll', calculateDistance)
  document.removeEventListener('scroll', levmsgScoll)
})
</script>

<style lang="scss" scoped>
.detail-container {
  .wrapper {
    width: 1224px;
    margin: 0 auto;
    .detail-top {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      width: 100%;
      margin: 10px 0;

      .detail-left {
        position: relative;
        top: 0;
        left: 0;
        width: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 80vh;
        margin-right: 10px;
        padding: 10px;
        background-color: $bgc-color1;
        border-radius: 5px;
        overflow: hidden;
        .sidebar {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 120px;
          background-color: rgba($color: $bgc-color1, $alpha: 0.6);
          text-align: center;
          fill-opacity: 10px;
          overflow: hidden;
          transition: transform 0.5s ease; /* 使用transform和过渡效果实现缓动 */
          transform-origin: 0 100%;
          transform: translateY(120px);
          .collapsed {
            transform: translateY(-120px); /* 切换图片时缩略图列表水平缩放为1，显示在右侧 */
          }
          .sidebar-img {
            padding: 10px;
            cursor: pointer;
          }
        }

        .sidebar.collapsed {
          transform: scaleX(1); /* 切换图片时缩略图列表水平缩放为1，显示在右侧 */
        }
      }

      .detail-right {
        width: 30%;
        .detail-right-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          margin-bottom: 10px;
          background-color: $bgc-color1;
          border-radius: 5px;
          overflow: hidden;

          .author-info {
            display: flex;
            align-items: center;

            .author-img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              margin-right: 10px;
              overflow: hidden;
              cursor: pointer;

              .auimg {
                height: 100%;
                width: 100%;
              }
            }

            .author-msg {
              display: flex;
              flex-direction: column;

              .auname {
                font-size: 18px;
                font-weight: bolder;

                a {
                  color: $text-color1;
                }
              }

              .auid {
                font-size: 14px;
                padding-top: 5px;
                color: $text-color3;
              }
            }
          }
        }
        .detail-right-bottom {
          margin-top: 10px;
          padding: 10px;
          background-color: $bgc-color1;
          border-radius: 5px;
          overflow: hidden;
          .other-works {
            color: $text-color1;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .other-works-item {
            height: 100%;
            display: flex;
            margin-bottom: 10px;
            background-color: $bgc-color2;
            padding: 10px;
            border-radius: 5px;
            overflow: hidden;

            .other-works-img {
              height: 120px;
              width: 150px;
            }
            .other-works-container {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-left: 10px;
              width: 100%;
              .other-works-info {
                .other-works-title {
                  white-space: nowrap; /* 确保文本在一行内显示 */
                  overflow: hidden; /* 隐藏溢出部分 */
                  text-overflow: ellipsis; /* 显示省略号 */
                }
                .other-works-description {
                  margin-top: 10px;
                  display: -webkit-box;
                  -webkit-line-clamp: 2; /* 限制最大行数为2行 */
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis; /* 显示省略号 */
                }
              }
              .other-works-other {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                .action-container {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  .svg-item {
                    margin-left: 5px;

                    -webkit-user-select: none;
                    /* Safari */
                    -moz-user-select: none;
                    /* Firefox */
                    -ms-user-select: none;
                    /* IE 10+ */
                    user-select: none;
                    /* 其他浏览器 */
                  }
                }
              }
            }
          }
        }
      }
    }

    .detail-bottom {
      width: 100%;
      height: 100%;

      .detail-content {
        height: 100%;
        padding: 10px;
        background-color: $bgc-color1;
        border-radius: 5px;
        margin: 10px 0;

        .user-action {
          display: flex;
          align-items: center;
          justify-content: center;
          .action-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 20px;
            cursor: pointer;
            .svg-item {
              font-size: 18px;
              margin: 0 10px;

              color: $text-color2;
            }
          }
        }

        .detail-title {
          margin-bottom: 10px;

          h2 {
            font-size: 19px;
            margin-right: 10px;
            margin-bottom: 10px;
            color: $text-color1;
          }

          span {
            font-size: 12px;
            margin-right: 20px;
            color: $text-color3;
          }
        }

        .user-action {
          font-size: 16px;
        }
      }

      .detail-msg {
        margin-top: 20px;
        letter-spacing: 1px;
        color: $text-color2;
      }
    }
  }

  /* 留言 */
  .lvmsg-list {
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 10px;
    overflow: hidden;
    background-color: $bgc-color1;
    .lvmsg-header {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      top: 0;

      .lvmsg-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        h2 {
          margin-right: 10px;
          font-size: 18px;
          color: $text-color1;
        }
      }
      .lvmsg-sort {
        span {
          margin: 0 5px;
          cursor: pointer;
        }
        .sort-selected {
          color: #e88;
        }
      }
    }

    ul {
      padding: 10px 0;
      border-top: 1px solid $text-color1;
      border-bottom: 1px solid $text-color1;

      li {
        width: 100%;
        position: relative;
        margin-bottom: 20px;
        padding: 4px 5px;
        border-bottom: 1px dashed $text-color1;
        background-color: $bgc-color2;
        border-radius: 5px;
        .lvmsg-item {
          padding: 10px;
          display: flex;
          flex-direction: column;
          white-space: pre-line;
          word-break: break-all;
          .lvmsg-user {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .lvmsg-user-left {
              display: flex;
              justify-content: center;
              align-items: center;
              .lvmsg-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
                overflow: hidden;
              }
              .lvmsg-username {
                text-align: center;

                a {
                  color: $text-color2;
                  font-weight: bold;
                  letter-spacing: 4px;
                }
              }
            }
            .lvmsg-date {
              margin-right: 10px;
              font-size: 14px;
              text-align: right;
            }
          }
          .lvmsg-container {
            padding-left: 50px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .lvmsg-content {
              line-height: 1.6em;
              letter-spacing: 1px;
              color: $text-color2;
            }
            .iconfont {
              display: inline-block;
              margin: 0 10px;
            }
          }
        }
        .popup-levmsg {
          width: 70px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 20px;
          right: 40px;
          border-radius: 10px;
          background-color: #fff;
          opacity: 1;
          cursor: pointer;
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
          z-index: 1;
        }

        .popover-enter-from,
        .popover-leave-to {
          transform: translateX(-100%);
          opacity: 0;
        }

        .popover-leave-from,
        .popover-enter-to {
          opacity: 1;
        }
      }
    }
    .load-more {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-content: center;
      text-align: center;
      padding: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    .user-liuyan {
      margin-bottom: 10px;
      .levmsg-enter {
        position: relative;
        margin-bottom: 10px;
        z-index: 1;
      }
      .levmsg-submit {
        overflow: hidden;
        opacity: 0;
        transform: translateY(-50px) scaleY(0);
        text-align: right;
        max-height: 0;
        transition:
          max-height 0.3s ease,
          transform 0.3s ease,
          opacity 0.3s ease;
      }
      .expanded {
        transform: translateY(0);
        opacity: 1;
        max-height: 50px; /* 调整为按钮的实际高度 */
      }
    }
    .user-liuyan-float {
      position: fixed;
      bottom: 0;
      left: 50%;
      width: 1200px;
      background-color: $bgc-color1;
      padding: 10px;
      border: 5px solid $bgc-color2;
      border-bottom: none;
      box-shadow: 0px 0px 9px #a7a7a7;
      border-radius: 10px;
      transform: translateX(-50%);
      transition: opacity 0.3s ease;
    }
    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 130px;
      .empty-info {
        display: flex;
        flex-direction: column;
        cursor: pointer;
        span {
          padding: 10px;
          color: $text-color3;
        }
      }
      .empty-loading {
        cursor: pointer;
        span {
          padding: 10px;
          color: $text-color3;
        }
      }
    }
  }
}
.liuyan-enter-from,
.liuyan-leave-to {
  opacity: 0;
}

.liuyan-leave-from,
.liuyan-enter-to {
  opacity: 1;
}
</style>
