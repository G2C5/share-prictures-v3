<template>
  <div class="container">
    <!-- 搜索 -->
    <div class="search-container">
      <!-- 上：搜索 -->
      <div class="search-input">
        <!-- 时间 -->
        <div class="search-date">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            unlink-panels
            range-separator="To"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            size="default"
            :clearable="true"
          />
        </div>
        <!-- 排序类型\关键字 -->
        <div class="search-content">
          <!-- 排序字段 -->
          <el-select
            popper-class="mySelectStyle"
            class="select-demo"
            v-model="sortMode"
            placeholder="排序类型"
            style="width: 80px"
          >
            <el-option label="收藏" value="collect" />
            <el-option label="点赞" value="like" />
            <el-option label="浏览" value="views" />
            <el-option label="时间" value="date" />
          </el-select>
          <!-- 排序类型 -->
          <el-select
            popper-class="mySelectStyle"
            v-model="sortState"
            placeholder="排序类型"
            style="width: 80px"
          >
            <el-option label="降序" value="desc" />
            <el-option label="升序" value="asc" />
          </el-select>
          <!-- 关键字 -->
          <div class="search-enter" ref="searchRef">
            <div>
              <el-input
                v-model.lazy="keyword"
                style="max-width: 600px"
                placeholder="请输入搜索内容"
                @keyup.enter="search"
                class="input-with-select"
                clearable
                @click.stop=""
                @focus="handleFocus"
              >
                <template #append>
                  <el-button @click="search" :loading="loading" :icon="Search" />
                </template>
              </el-input>
            </div>
            <!-- 历史记录 -->
            <div
              class="search-history"
              v-if="recordType.showHistoryList && keywordHistory.history.length"
            >
              <div class="search-header">
                <div class="title">搜搜记录</div>
                <div class="clear" @click="delAllHistory">清空</div>
              </div>
              <div
                ref="historyBodyRef"
                class="search-body"
                :class="{ 'show-more': recordType.showHistoryMore }"
              >
                <div class="search-body-content" ref="historyContentRef">
                  <div
                    class="history-item"
                    v-for="(k, i) in keywordHistory.history"
                    :key="k.id"
                    @mouseenter="recordType.showHistoryDelBtn = k.keyword"
                    @mouseleave="recordType.showHistoryDelBtn = ''"
                    @click="keyword = k.keyword"
                  >
                    <span class="history-text" :key="i">{{ k.keyword }}</span>
                    <SvgIcon
                      v-show="recordType.showHistoryDelBtn == k.keyword"
                      @click.stop="delHistoryByKwName(k.keyword)"
                      class="del-text"
                      icon-name="icon-shanchu"
                    ></SvgIcon>
                  </div>
                </div>
              </div>
              <div class="search-footer" v-show="recordType.showMoreBtn">
                <el-button link @click="recordType.showHistoryMore = !recordType.showHistoryMore">{{
                  recordType.showHistoryMore ? '收起' : '查看更多...'
                }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 下：标签 -->
      <div class="selected-tags">
        <div>
          <el-tag
            style="margin-right: 10px"
            v-for="tag in dynamicTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model.lazy="inputValue"
            class="w-20"
            size="small"
            placeholder="请输入标签"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
            style="width: 200px"
          />
          <el-button
            v-else
            class="button-new-tag"
            v-show="dynamicTags.length <= 7"
            size="small"
            @click="showInput"
          >
            + 搜索标签
          </el-button>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="rank-container">
      <div class="rank-list">
        <div v-if="searchResult.length === 0" class="search-none">
          <img src="../../public/images/notfound.jpeg" style="height: 80vh" alt="404 not found" />
        </div>
        <div
          v-else
          class="rank-content"
          v-for="(image, index) in searchResult"
          :key="image._id"
          @click="toggleRankMark(index)"
        >
          <!-- 图片 -->
          <el-image style="height: 100%" :src="image.imageUrl[0].url" lazy />
          <!-- 内容 -->
          <div class="rank-mark" :style="{ opacity: showRankMark[index] ? 1 : 0 }">
            <div class="image-info">
              <div class="image-title">
                <h2>{{ image.title }}</h2>
              </div>
              <div class="image-description">
                <p>{{ image.description }}</p>
              </div>

              <div class="image-like">
                <div>
                  <SvgIcon iconName="icon-views1" color="#fff" />
                  <span class="image-num">{{ image.views }}</span>
                </div>
                <div>
                  <SvgIcon iconName="icon-like1" color="#fff" />
                  <span class="image-num">{{ image.like }}</span>
                </div>
                <div>
                  <SvgIcon iconName="icon-collect1" color="#fff" />
                  <span class="image-num">{{ image.collect }}</span>
                </div>
              </div>
              <div class="image-tags">
                <span v-for="(tag, index) in image.tags" :key="index">{{ tag }}</span>
              </div>
              <div class="image-date">
                <span>{{ image.date }}</span>
              </div>
              <div class="register-link">
                <el-button class="go-detail" link @click="openPictureDetail(image._id)"
                  >去看看</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, nextTick, onUnmounted, onMounted, watchEffect } from 'vue'
import type { SearchImageData, SearchParams } from './types/types'
import { Search } from '@element-plus/icons-vue'
import { ElInput } from 'element-plus'
import useCurrentInstance from '../hooks/useCurrentInstance'
import { useRoute } from 'vue-router'
import usePicture from '@/hooks/usePicture'
import Local from '@/utils/localStorage'
import moment from 'moment'
import _ from 'lodash'
const { openPictureDetail } = usePicture()
const { proxy } = useCurrentInstance()
const route = useRoute()
const keyword = ref('') // 搜搜关键字
const sortMode = ref('date') // 排序类型：默认时间
const sortState = ref('desc') // 排序模式：默认降序
const time = ref([]) // 时间范围：默认空
const keywordHistory = reactive({ history: [] } as {
  history: Array<{
    id: string
    keyword: string
  }>
}) //搜索记录
const inputValue = ref('') // 当前输入标签
const dynamicTags = ref<string[]>([]) // 所有标签
// 分页
const pagination = reactive({ page: 1, pageSize: 20 })
const InputRef = ref<InstanceType<typeof ElInput>>()
const loading = ref(false) // 按钮加载显示
const searchRef = ref<HTMLElement | null>(null)
const historyContentRef = ref<HTMLElement | null>(null)
const recordType = reactive({
  showHistoryList: false, // 是否展示历史记录
  showHistoryMore: false, // 是否展开更多历史记录
  showHistoryDelBtn: '', // 展示删除指定历史记录按钮
  showMoreBtn: false // 是否展开更多历史记录按钮
})
const inputVisible = ref(false) // 标签类型转变，input / tag转变
// 搜索的图片
const searchResult = ref([] as SearchImageData[]) // 最后展示结果
const recommendImgae = ref([] as SearchImageData[]) // 默认推荐图片
const showRankMark = ref(new Array(searchResult.value.length).fill(false)) // 图片信息展示内容状态标记
// 可选快捷时间范围
const shortcuts = [
  {
    text: '上一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '上一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]
// 判断产看更多历史记录按钮显示与隐藏
const shouldShowMore = () => {
  nextTick(() => {
    const historyContent = historyContentRef.value
    if (!historyContent) {
      console.log('kong')
      return false
    }
    console.log(historyContent.scrollHeight)
    recordType.showMoreBtn = historyContent.scrollHeight > 90
  })
}
// handleFocus
const handleFocus = () => {
  recordType.showHistoryList = true
  shouldShowMore()
}
// 搜索
const search = _.debounce(async () => {
  try {
    loading.value = true
    searchResult.value = []
    // 没有输入搜索数据展示推荐图片
    if (!keyword.value && dynamicTags.value.length <= 0) {
      searchResult.value = recommendImgae.value
      return
    }
    // 整理数据
    const searchData: SearchParams = {
      keyword: keyword.value || undefined,
      tags: dynamicTags.value || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
      sort_mode: sortMode.value,
      sort_state: sortState.value,
      startDate: time.value?.[0] || undefined,
      endDate: time.value?.[1] || undefined
    }
    // 记录搜索历史
    setHistory(keyword.value)
    const result = await proxy.$http.searchShareImage(searchData)
    searchResult.value = result.data.imageData
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}, 200)
// 初始化搜索历史
const initHostory = () => {
  try {
    const result: {
      history: Array<{
        id: string
        keyword: string
      }>
    } = Local.getItem('SHARE_KEYWORD_HISTORY') || { history: [] }
    keywordHistory.history = result.history
  } catch (error) {
    console.log(error)
  }
}
// 保存搜索历史
const setHistory = (keyword: string) => {
  try {
    // 如果keyword重复，删除重复记录
    const existingIndex = keywordHistory.history.findIndex((item) => item.keyword === keyword)
    if (existingIndex !== -1) {
      keywordHistory.history.splice(existingIndex, 1)
    }
    // 达到上限删除最后一个元素
    if (keywordHistory.history.length > 20) {
      keywordHistory.history.pop()
    }

    // 保存最新记录
    keywordHistory.history.unshift({
      id: moment().unix().toString(),
      keyword
    })
    // 整理记录
    // 本地保存记录
    Local.setItem('SHARE_KEYWORD_HISTORY', keywordHistory)
  } catch (error) {
    console.log(error)
  }
}
// 删除所有历史记录
const delAllHistory = () => {
  Local.removeItem('SHARE_KEYWORD_HISTORY')
  keywordHistory.history = []
}
// 删除指定历史记录
const delHistoryByKwName = (keyword: string) => {
  try {
    // 遍历历史记录数组
    for (let i = 0; i < keywordHistory.history.length; i++) {
      if (keywordHistory.history[i].keyword === keyword) {
        keywordHistory.history.splice(i, 1)
        break
      }
    }
    Local.setItem('SHARE_KEYWORD_HISTORY', keywordHistory)
  } catch (error) {
    console.error(error)
  }
}
// 删除标签
const handleClose = (tag: string) => {
  const index = dynamicTags.value.indexOf(tag)
  if (index !== -1) {
    dynamicTags.value.splice(index, 1)
  }
}
// 标签输入
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
// 标签输入完成
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
// 图片的介绍信息
const toggleRankMark = (index: number) => {
  for (let i = 0; i < showRankMark.value.length; i++) {
    if (i !== index) {
      showRankMark.value[i] = false
    }
  }
  showRankMark.value[index] = !showRankMark.value[index]
}
// 推荐图片
const getSiteRecommended = async () => {
  try {
    const result = await proxy.$http.siteRecommended()
    recommendImgae.value = result.data
    searchResult.value = result.data
  } catch (error) {
    console.log(error)
  }
}
// 监听：文档点击事件
const handleClickOutside = _.throttle((event: MouseEvent) => {
  // 判断点击的元素是否在 search-history 内部
  const target = event.target as HTMLElement
  const clearableBtn = target.closest('.el-input__clear')
  if (!searchRef.value?.contains(target) && !clearableBtn) {
    console.log(1)
    // 如果点击的元素不在 search-history 内部，则隐藏历史记录
    recordType.showHistoryList = false
  }
}, 300)
// 监视：用户搜索数据为空,且用户选择搜索关键字等为空,重现推荐数据
const unWatchEffect = watchEffect(() => {
  if (!keyword.value && !searchResult.value.length && !dynamicTags.value.length) {
    searchResult.value = recommendImgae.value
  }
})

// 初始化
function init() {
  initHostory() // 搜索记录
  document.addEventListener('click', handleClickOutside)
  const tag = route.query.tag
  // 如果有传入来的query标签
  if (tag && typeof tag === 'string') {
    dynamicTags.value.push(tag) // 搜索图片
    search()
  } else {
    getSiteRecommended() // 推荐图片
  }
}
const unwatch = watch(
  keywordHistory,
  (newValue, oldValue) => {
    shouldShowMore()
  },
  { deep: true, immediate: true }
)
onMounted(() => {
  init()
})
onUnmounted(() => {
  unWatchEffect()
  unwatch()
})
</script>

<style lang="scss" scoped>
.container {
  max-width: 1224px;
  min-width: 600px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;

  .search-container {
    width: 100%;
    position: relative;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    @include bgc-color('bgc-color1', 1);
    z-index: 1;

    .search-input {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 10px;
      margin-bottom: 10px;

      .search-content {
        display: flex;
        ::v-deep el-select-dropdown__item is-hovering {
          background-color: #e88;
        }
        .search-enter {
          position: relative;
          .input-with-select {
            min-width: 360px;
            max-width: 450px;
          }

          .search-history {
            position: absolute;
            top: 100%;
            width: 100%;
            padding: 0 10px;
            background-color: #eee;
            border-radius: 0 0 10px 10px;
            box-shadow: 0px 12px 12px rgba($color: rgb(0, 0, 0), $alpha: 0.2);
            border: 1px solid rgb(180, 180, 180);
            border-top: none;
            color: #000000;

            .search-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              .title {
                font-size: 16px;
              }
              .clear {
                color: $text-color3;
                cursor: pointer;
              }
            }
            .search-body {
              padding: 10px;
              width: 100%;
              max-height: 100px;
              overflow: hidden;
              .search-body-content {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                .history-item {
                  max-width: 96px;
                  position: relative;
                  margin-bottom: 10px;
                  padding: 7px 10px 8px;
                  height: 30px;
                  border-radius: 4px;
                  line-height: 15px;
                  background-color: $bgc-color3;
                  text-overflow: ellipsis;
                  cursor: pointer;
                  .history-text {
                    display: inline-block;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 12px;
                    white-space: nowrap;
                  }
                  .del-text {
                    position: absolute;
                    top: -5px;
                    right: -6px;
                    background-color: #fff;
                    border-radius: 50%;
                    border: 1px solid #fff;
                  }
                }
              }
            }
            .show-more {
              height: 100%;
              overflow-y: scroll;
              overflow: auto;
            }
            .search-footer {
              border-top: 2px solid #eef;
              margin-top: 5px;
              margin-bottom: 10px;
              text-align: center;
            }
          }
        }
      }
    }
    .selected-tags {
      margin: 0;
    }
  }
  .rank-container {
    width: 100%;
    height: 80vh;
    .rank-list {
      width: 100%;
      height: 80vh;
      overflow-y: auto;
      .search-none {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $bgc-color3;
      }
      .rank-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
        margin-bottom: 10px;
        position: relative;
        background-color: $bgc-color3;

        .rank-mark {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: -moz-linear-gradient(
            top,
            rgba(23, 24, 32, 0.95),
            rgba(23, 24, 32, 0.95)
          );
          background-image: -webkit-linear-gradient(
            top,
            rgba(23, 24, 32, 0.75),
            rgb(85 85 85 / 65%)
          );
          background-image: -ms-linear-gradient(
            top,
            rgba(23, 24, 32, 0.95),
            rgba(23, 24, 32, 0.95)
          );
          background-image: linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
          opacity: 0;
          transition: opacity 0.5s;
          div {
            color: white;
          }
        }
        .image-info {
          position: absolute;
          right: 40%;
          padding: 80px 10px 10px;
          width: 370px;
          cursor: pointer;

          .image-title {
            text-align: left;
            line-height: 3.5em;
            margin-bottom: 10px;
            h2 {
              border-bottom: 2px solid $text-color3;
            }
          }
          .image-description {
            padding: 10px;
            margin-bottom: 50px;
            p {
              text-indent: 2em;
              line-height: 1.5em;
            }
          }
          .image-tags {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            border-bottom: 2px solid $text-color3;
            padding-bottom: 10px;
            span {
              font-size: 14px;
              padding: 0 4px;
              margin-right: 10px;
              margin-bottom: 5px;
              background-color: rgba($color: $bgc-color1, $alpha: 0.2);
              border-radius: 2px;
            }
          }
          .image-like {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 30px;
            .image-num {
              margin-left: 5px;
            }
          }
          .image-date {
            width: 100%;
            text-align: right;
            padding: 10px 0 10px;
          }
          .register-link {
            text-align: right;
            .go-detail {
              margin-right: 5px;
              padding: 10px 0;
              color: rgb(213, 206, 250);
            }
          }

          .register-link span {
            color: $text-color1;
            margin-bottom: 5px;
          }
        }
        .el-image {
          display: block;
          min-height: 200px;
        }
        .el-image:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.el-popper.mySelectStyle {
  .el-select-dropdown__item {
    text-align: center;
  }
  .el-select-dropdown__item.is-selected {
    color: #e88;
  }
}
::v-deep .el-select__placeholder {
  color: #e88;
}
</style>
