<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="demo-tabs">
      <el-tab-pane
        v-for="(el, index) in elTabPaneData"
        v-loading="loading"
        :label="el.label"
        :name="el.name"
        lazy
      >
        <div class="hot-container">
          <SpVirtualWaterFall :gap="5" :column="3" :request="el.method" :pageSize="20">
            <template #item="{ item }">
              <div class="card">
                <div style="overflow: hidden">
                  <el-image
                    class="card-image"
                    @click="openPictureDetail(item.id)"
                    :src="item.src"
                    alt="图片"
                    lazy
                  >
                    <template #placeholder>
                      <div class="image-slot">
                        <div>Loading<span class="dot">...</span></div>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="card-info">
                  <div class="card-title">
                    <h4>{{ item.title }}</h4>
                  </div>
                  <p class="card-description">{{ item.description }}</p>
                  <div class="card-data">
                    <div>
                      <SvgIcon color="#3a3a3a" iconName="icon-icon_liulan-xian"></SvgIcon>
                      <span class="svg-item">{{ item.views }}</span>
                    </div>
                    <div>
                      <SvgIcon color="#3a3a3a" iconName="icon-icon_dianzan-xian"></SvgIcon>
                      <span class="svg-item">{{ item.like }}</span>
                    </div>
                    <div>
                      <SvgIcon color="#3a3a3a" iconName="icon-icon_shoucang-xian"></SvgIcon>
                      <span class="svg-item">{{ item.collect }}</span>
                    </div>
                    <span class="card-time">{{ item.date }}</span>
                  </div>
                </div>
              </div>
            </template>
          </SpVirtualWaterFall>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SpVirtualWaterFall from '../components/SpVirtualWaterFall/SpVirtualWaterFall.vue'
import type { TabsPaneContext } from 'element-plus'
import { reactive, ref, onMounted, computed } from 'vue'
import useCurrentInstance from '../hooks/useCurrentInstance'
import usePicture from '@/hooks/usePicture'
const { openPictureDetail } = usePicture()
const { proxy } = useCurrentInstance()
const loading = ref(true)
const router = useRouter()
// 分页
const pagination = reactive({ page: 1, pageSize: 20 })
const activeName = ref('first')
// 最新分享
const latestSharing = async () => {
  try {
    loading.value = true
    // 请求，并传入分页参数
    const result = await proxy.$http.latestSharing(pagination)
    pagination.page++
    const rows = result.data.map((i: any) => ({
      id: i._id,
      userId: i.userId,
      src: i.imageUrl.url,
      width: i.imageUrl.width,
      height: i.imageUrl.height,
      title: i.title,
      description: i.description,
      tags: i.tags,
      views: i.views,
      collect: i.collect,
      like: i.like,
      date: i.date
    }))

    return {
      total: rows.length,
      list: rows
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
// 本周
const popularWeekViews = async () => {
  try {
    loading.value = true
    const result = await proxy.$http.getWeeklyHotShareImage(pagination)
    const rows = result.data.map((i: any) => ({
      id: i._id,
      userId: i.userId,
      src: i.imageUrl[0].url,
      width: i.imageUrl[0].width,
      height: i.imageUrl[0].height,
      title: i.title,
      description: i.description,
      tags: i.tags,
      views: i.views,
      collect: i.collect,
      like: i.like,
      date: i.date
    }))
    pagination.page++
    return {
      total: rows.length,
      list: rows
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
// 本月
const popularMonthViews = async () => {
  try {
    loading.value = true
    const result = await proxy.$http.getMonthlyHotShareImage(pagination)
    const rows = result.data.map((i: any) => ({
      id: i._id,
      userId: i.userId,
      src: i.imageUrl[0].url,
      width: i.imageUrl[0].width,
      height: i.imageUrl[0].height,
      title: i.title,
      description: i.description,
      tags: i.tags,
      views: i.views,
      collect: i.collect,
      like: i.like,
      date: i.date
    }))
    pagination.page++
    return {
      total: rows.length,
      list: rows
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
// 历史
const greatestHistoryViews = async () => {
  try {
    loading.value = true
    const result = await proxy.$http.greatestHistory(pagination)
    const rows = result.data.map((i: any) => ({
      id: i._id,
      userId: i.userId,
      src: i.imageUrl[0].url,
      width: i.imageUrl[0].width,
      height: i.imageUrl[0].height,
      title: i.title,
      description: i.description,
      tags: i.tags,
      views: i.views,
      collect: i.collect,
      like: i.like,
      date: i.date
    }))
    pagination.page++
    return {
      total: rows.length,
      list: rows
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const elTabPaneData = reactive([
  { label: '最新分享', name: 'first', method: latestSharing },
  { label: '本周热门', name: 'second', method: popularWeekViews },
  { label: '本月热门', name: 'third', method: popularMonthViews },
  { label: '历史热门', name: 'fourth', method: greatestHistoryViews }
])
const handleClick = async (tab: TabsPaneContext, event: Event) => {
  pagination.page = 1
}

const init = () => {
  elTabPaneData.forEach((el) => {})
}
onMounted(() => {})
</script>

<style scoped lang="scss">
.container {
  max-width: 1224px;
  min-width: 600px;
  @include bgc-color('bgc-color1', 0.77);

  margin: 0 auto;
  .demo-tabs {
    @include bgc-color('bgc-color1', 0.77);
    ::v-deep .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }
    ::v-deep .el-tabs__nav-wrap::after {
      content: none;
    }
    ::v-deep .el-tabs__header {
      padding: 0 10px;
      margin-top: 10px;
      // background-color: $bgc-color1;

      @include bgc-color('bgc-color1', 0.77);
    }
    ::v-deep .el-tab-pane {
      background-color: $bgc-color1;
    }
    ::v-deep .el-tabs__item:hover {
      @include color('font-color-activity1');
    }
    ::v-deep .el-tabs__item {
      font-weight: bolder;
      @include color('font-color1');
    }
    ::v-deep .is-active {
      @include color('font-color-activity1');
    }
    ::v-deep .el-tabs__active-bar {
      background-color: #0ee;
      @include bgc-color('font-color-activity1', 1);
    }
  }

  .hot-container {
    height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 auto;
    @include bgc-color('bgc-color1', 0.66);
    .card {
      padding: 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      @include bgc-color('bgc-color1', 1);
      border-radius: 5px;
      @include box-shadow(0, 0, 10, 0, 'shadow-color2');
      overflow: hidden;

      .card-image {
        width: 100%;
        height: 100%;
        animation: identifier 0.4s;
        transition: transform 0.3s ease;
        .image-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          // background: var(--el-fill-color-light);
          // @include bgc-color('bgc-color1', 0.77);
          color: var(--el-text-color-secondary);
          // @include color('font-color1');
          font-size: 16px;
          .dot {
            animation: dot 2s infinite steps(3, start);
            overflow: hidden;
          }
        }
      }
      .card-image:hover {
        transform: scale(1.2);
      }

      .card-info {
        .card-title {
          h4 {
            @include color('font-color1');
            line-height: 2.5em;
          }
        }
        .card-description {
          font-size: 14px;
          margin-bottom: 4px;
          @include color('font-color2');
          white-space: nowrap; /* 不换行 */
          overflow: hidden; /* 隐藏溢出内容 */
          text-overflow: ellipsis; /* 显示省略号 */
        }
        .card-data {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .svg-item {
            display: inline-block;
            @include color('font-color2');
            font-size: 14px;
            margin-left: 10px;
          }
          .card-time {
            font-size: 12px;
            @include color('font-color2');
          }
        }
      }
    }
  }
}

@keyframes identifier {
  from {
    opacity: 0;
    transform: translateY(200px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
