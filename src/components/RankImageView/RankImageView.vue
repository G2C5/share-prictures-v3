<template>
  <div class="rank-list">
    <div
      class="rank-content"
      v-for="(url, index) in urls"
      @click="toggleRankMark(index)"
      :key="index"
    >
      <!-- 图片 -->
      <el-image :src="url" lazy />
      <!-- 内容 -->
      <div class="rank-mark" :style="{ opacity: showRankMark[index] ? 1 : 0 }">
        <div class="image-info">
          <div class="image-title">
            <h2>蒲公英</h2>
          </div>
          <div class="image-description">
            <p>
              我的蒲公英在小学六年级吹完了，每一朵蒲公英都只是随着我吹的一口气飘散，看它漫天飞舞的雪白，就像触及蓝天的的白云，开心的笑着，承载着我天马行空的想象，映照着美好，一朵又一朵，希望能飞向远方的天空。
            </p>
          </div>
          <div class="image-tags">
            <span>fjalksgj</span>
            <span>蒲公英</span>
            <span>小学六年级</span>
            <span v-for="(item, index) of 6">标签{{ item }}</span>
          </div>
          <div class="image-other">
            <span>浏览{{ 0 }}</span>
            <span>点赞{{ 12 }}</span>
            <span>收藏{{ 50 }}</span>
          </div>
          <div class="image-date">
            <span>2024-17-12 13:50</span>
          </div>
          <div class="register-link">
            <span
              ><el-button link style="color: rgb(114, 106, 238)" @click="">去看看</el-button></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const showRankMark = ref(new Array(urls.length).fill(false))

const toggleRankMark = (index: number) => {
  // 隐藏其他图片的遮罩层
  for (let i = 0; i < showRankMark.value.length; i++) {
    if (i !== index) {
      showRankMark.value[i] = false
    }
  }
  showRankMark.value[index] = !showRankMark.value[index]
}
</script>

<style lang="scss" scoped>
.rank-list {
  width: 100%;
  height: 80vh;
  overflow-y: auto;
  .rank-content {
    width: 100%;
    margin-bottom: 10px;
    position: relative;

    .rank-mark {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: -moz-linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
      background-image: -webkit-linear-gradient(top, rgba(23, 24, 32, 0.75), rgb(85 85 85 / 65%));
      background-image: -ms-linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
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
      padding: 10px;
      width: 370px;
      cursor: pointer;

      .image-title {
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
        span {
          font-size: 14px;
          padding: 0 4px;
          margin-right: 10px;
          margin-bottom: 5px;
          background-color: rgba($color: $bgc-color1, $alpha: 0.2);
          border-radius: 2px;
        }
      }
      .image-other {
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
        margin-bottom: 30px;
        span {
        }
      }
      .image-date {
        width: 100%;
        text-align: right;
        padding-bottom: 10px;
        border-bottom: 2px solid $text-color3;
      }
      .register-link {
        text-align: right;
        margin-top: 20px;
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
</style>
