<template>
  <div>
    <el-pagination
      :hide-on-single-page="total == 0 || totalPages < 2"
      :small="isSmall"
      class="msg-pagination-container"
      :background="true"
      :page-size="pageSize"
      :pager-count="pagerCount"
      :total="total"
      v-model:current-page="currentPage"
      :layout="isFirstPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = withDefaults(
  defineProps<{
    isSmall?: boolean
    page?: number
    size?: number
    pagerCount?: number
    total?: number
    bgcolor?: string
  }>(),
  {
    isSmall: false, // 分页器大小
    page: 1, //当前页面
    size: 10, //每页条数
    pagerCount: 7, //页码按钮的数量
    total: 100, // 数据总条数
    bgcolor: 'none' // 背景颜色
  }
)
const emit = defineEmits(['update:page', 'update:size', 'change'])
// 当前页面
const currentPage = computed({
  get: () => {
    return props.page
  },
  set: (val: number) => {
    emit('update:page', val)
    emit('change')
  }
})
// 每页条数
const pageSize = computed({
  get: () => {
    return props.size
  },
  set: (val: number) => {
    emit('update:page', 1)
    emit('update:size', val)
    emit('change')
  }
})
// 计算总页数
const totalPages = computed(() => Math.ceil(props.total / props.size))
// 是否为第一页
const isFirstPage = computed(() => {
  if (props.page === 1) {
    return ' pager, next'
  }
  if (props.page === totalPages.value) {
    return 'prev, pager'
  }
  return 'prev, pager, next'
})
</script>

<style lang="scss" scoped>
::v-deep .msg-pagination-container.is-background .el-pager li {
  /*对页数的样式进行修改*/
  background-color: $bgc-color2;
  color: $text-color1;
}

::v-deep .msg-pagination-container.is-background .btn-next {
  /*对下一页的按钮样式进行修改*/
  background-color: $bgc-color2;
  color: $text-color1;
}

::v-deep .msg-pagination-container.is-background .btn-prev {
  /*对上一页的按钮样式进行修改*/
  background-color: $bgc-color2;
  color: $text-color1;
}

::v-deep .msg-pagination-container.is-background .el-pager li:not(.disabled).is-active {
  /*当前选中页数的样式进行修改*/
  background-color: $bgc-color1;
  color: $text-color1;
}
</style>
