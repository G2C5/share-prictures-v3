<template>
  <div class="sp-virtual-waterfall-container">
    <div class="sp-virtual-waterfall-content" ref="contentRef">
      <div class="sp-virtual-waterfall-list" :style="contentStyle">
        <div
          class="sp-virtual-waterfall-item"
          v-for="{ item, style } in renderList"
          :key="item.id"
          :style="style"
        >
          <slot name="item" :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, markRaw, onMounted, onUnmounted, computed, ref } from 'vue'
import type {
  IVirtualWaterFallProps,
  IItemRect,
  IDataItem,
  IColumnQueue,
  IRenderItem
} from './type'
import { rafThrottle, debounce } from '../../utils/tools'
import { type CSSProperties } from 'vue'
import EmptyDiv from '../EmptyDiv/EmptyDiv.vue'
// props默认值
const props = withDefaults(defineProps<IVirtualWaterFallProps>(), {
  request: async () => ({ list: [], total: 0 }),
  gap: 20, // 图片与图片间距
  column: 4, // 列数
  columnItemCount: 5, // 单列中容纳最小项数
  requestSize: 0 // 请求页数|数据量
})
//
const emit = defineEmits<{
  finishLoadData: []
}>()
//
defineSlots<{
  item(props: { item: IDataItem }): any
}>()
// ref容器
const contentRef = ref<HTMLDivElement>()
// 主要数据源
const dataState = reactive({
  loading: false, // 请求数据状态标记
  isFinish: false, // 分页请求无数据标记
  currentPage: 1, // 当前页面
  total: 0, // 数据项
  list: [] as IDataItem[] // 请求数据源
})
// 二维数组：数据列信息
const columnState = reactive({
  queue: Array(props.column)
    .fill(0)
    .map<IColumnQueue>(() => ({ list: [], height: 0 })),
  len: 0
})
// 渲染试图数据
const scrollState = reactive({
  viewWidth: 0,
  viewHeight: 0,
  start: 0,
  get end() {
    return this.start + this.viewHeight
  }
})

// 计算：请求页数|数据量，传了使用传递值，没有则自行计算
const requestSize = computed(() => props.requestSize || props.column * props.columnItemCount)
// 计算：判断是否请求数据源，当列中项等于数据源需要请求
const hasMoreData = computed(() => columnState.len < dataState.list.length)
// 计算：最小高度列中最后一项坐标信息
const computedHeight = computed(() => {
  let minIndex = 0,
    maxIndex = 0,
    minHeight = Infinity,
    maxHeight = -Infinity
  columnState.queue.forEach(({ height }, index) => {
    if (height < minHeight) {
      minHeight = height
      minIndex = index
    }
    if (height > maxHeight) {
      maxHeight = height
      maxIndex = index
    }
  })
  return {
    minHeight,
    maxHeight,
    minIndex,
    maxIndex
  }
})
// 计算：源图片转换为瀑布流图片尺寸
const itemSizeInfo = computed(() => {
  return dataState.list.reduce<Map<IDataItem['id'], IItemRect>>((pre, current) => {
    const itemWidth = Math.floor(
      (scrollState.viewWidth - (props.column - 1) * props.gap) / props.column
    )
    pre.set(current.id, {
      width: itemWidth,
      height: Math.floor((itemWidth * current.height) / current.width)
    })
    return pre
  }, new Map())
})
// 计算：将二位队列转为一维数组
const columnlist = computed(() =>
  columnState.queue.reduce<IRenderItem[]>((pre, current) => pre.concat(current.list), [])
)
// 计算：实际渲染的list
const renderList = computed(() =>
  columnlist.value.filter((i) => i.h + i.y > scrollState.start && i.y < scrollState.end)
)
// 计算：固定.conten元素高度，避免滚动条上移动变大
const contentStyle = computed(
  () => ({ height: `${computedHeight.value.maxHeight}px` }) as CSSProperties
)
// set if
const setId = (item: any) => {
  return item.imageId + '.' + Date.now()
}
// 请求图片数据
const loadDataList = async () => {
  dataState.loading = true // 标记请求数据开始
  const { list, total } = await props.request(dataState.currentPage++, requestSize.value)
  console.log(dataState.currentPage++, requestSize.value)
  if (!list.length) {
    console.log('res list is null')
    dataState.isFinish = true // 标记请求无数据
    emit('finishLoadData') // 给父组件抛出一个自定义事件，提示没有数据了
    return
  }
  dataState.list.push(...markRaw(list)) // 追加数据项
  dataState.total = total // 更新当前请求数据项
  dataState.loading = false // 标记请求数据结束
}
// 图片数据进入队列
const addInQueue = (size = Math.floor(props.column)) => {
  // 设定默认进入队列图片为当前列数
  for (let i = 0; i < size; i++) {
    if (!hasMoreData.value) return
    const dataItem = dataState.list[columnState.len]
    const minIndex = computedHeight.value.minIndex
    const currentQueue = columnState.queue[minIndex]
    const before = currentQueue.list[currentQueue.list.length - 1] || null
    const genItem = generatorItem(dataItem, before, minIndex)
    currentQueue.list.push(genItem)
    currentQueue.height += genItem.h
    columnState.len++
  }
}
// 根据容器大小，计算瀑布流图片大小
const generatorItem = (item: IDataItem, before: IRenderItem | null, index: number): IRenderItem => {
  const rect = itemSizeInfo.value.get(item.id)
  const width = rect?.width || 0
  const height = rect?.height != null ? rect.height + 80 : 0
  let y = 0
  if (before) y = before.y + before.h + props.gap
  return markRaw({
    item,
    y,
    h: height,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate3d(${index === 0 ? 0 : (width + props.gap) * index}px, ${y}px, 0)`
    }
  })
}
// 得到容器宽高
const initScrollState = () => {
  scrollState.viewHeight = contentRef.value?.clientHeight || 0
  scrollState.viewWidth = contentRef.value?.clientWidth || 0
  scrollState.start = contentRef.value?.scrollTop || 0
}
// 滚动事件
const handlerScroll = rafThrottle(() => {
  const { scrollTop, clientHeight } = contentRef.value!
  scrollState.start = scrollTop
  if (!dataState.loading && !hasMoreData.value) {
    loadDataList().then(() => {
      addInQueue()
    })
    return
  }
  if (scrollTop + clientHeight > computedHeight.value.minHeight) addInQueue()
})
// 更新容器宽高
const reComputedColumn = () => {
  columnState.queue = columnState.queue.map((q, index) => {
    let height = 0
    const list = q.list.reduce<IRenderItem[]>((pre, { item }, i) => {
      const before = pre[i - 1] || null
      const result = generatorItem(item, before, index)
      height += result.h
      pre.push(result)
      return pre
    }, [])
    return {
      height,
      list
    }
  })
}
// 容器宽度自适应
const handleResize = debounce(() => {
  initScrollState()
  reComputedColumn()
}, 300)

const init = async () => {
  initScrollState()
  await loadDataList()
  addInQueue(requestSize.value)
  contentRef.value?.addEventListener('scroll', handlerScroll)
  window.addEventListener('resize', handleResize)
}
const destroy = () => {
  contentRef.value?.removeEventListener('scroll', handlerScroll)
  window.removeEventListener('resize', handleResize)
}
onMounted(() => {
  init()
})
onUnmounted(() => {
  destroy()
})
</script>

<style lang="scss" scoped>
.sp-virtual-waterfall-container {
  width: 100%;
  height: 80vh;
  .sp-virtual-waterfall-content {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    /* 定义滚动条滑块的样式 */
    ::-webkit-scrollbar {
      display: none; /* 隐藏滚动条 */
    }
    .sp-virtual-waterfall-list {
      position: relative;

      width: 100%;

      .sp-virtual-waterfall-item {
        position: absolute;
        padding: 5px;
        top: 0;
        left: 0;
        transition: all 0.3s;
      }
    }
  }
}
</style>
