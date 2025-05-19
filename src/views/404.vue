<template>
  <div class="not-found">
    <h1>页面未找到</h1>
    <p>很抱歉，您访问的页面不存在。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  // 如果需要传递额外的数据到 404 页面，可以在此处定义 props
})
</script>

<style scoped lang="scss">
.not-found {
  text-align: center;
  padding: 50px;
  font-size: 24px;

  h1 {
    font-size: 36px;
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 20px;
  }

  a {
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
