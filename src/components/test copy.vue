<template>
  <div class="gallery">
    <!-- 主要的大图展示区域 -->

    <img :src="currentUrl" alt="Main Image" @click="toggleSidebar" />

    <!-- 侧边的缩略图列表 -->
    <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <img
        v-for="(url, index) in urls"
        :key="index"
        :src="url"
        :alt="'Thumbnail ' + (index + 1)"
        @click="showImage(index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const urls = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
]

const currentUrl = ref(urls[0])
const isSidebarCollapsed = ref(false)

const showImage = (index) => {
  currentUrl.value = urls[index]
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<style lang="scss" scoped>
.gallery {
  position: relative;
  width: 50%;
  margin: 0 auto;
  .sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100%;
    overflow: hidden;
    transition: transform 0.5s ease; /* 使用transform和过渡效果实现缓动 */
    transform-origin: 100% 0; /* 设置缩放的原点为整个侧边缩略图的右边 */
    transform: scaleX(0); /* 初始状态下将缩略图列表水平缩放为0 */

    img {
      width: 100%;
      cursor: pointer;
    }
  }
  .sidebar.collapsed {
    transform: scaleX(1); /* 切换图片时缩略图列表水平缩放为1，显示在右侧 */
  }
}
</style>
