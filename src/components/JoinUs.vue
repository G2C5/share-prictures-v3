<template>
  <div v-if="visible" @click="handleClose" class="join-mask">
    <div class="join-container">
      <!--翻转内容 -->
      <div class="title" :class="{ 'title-select': index }">
        <div class="front">
          <h1>登录分享</h1>
        </div>
        <div class="back">
          <h1>加入我们</h1>
        </div>
      </div>

      <!-- 选择按钮 -->
      <div class="join-action">
        <div>
          <el-button @click="goLogin" class="login-btn">去登录</el-button>
          <el-button
            @mouseenter="index = true"
            @mouseleave="index = false"
            @click="goRegister"
            class="register-btn"
          >
            去注册
          </el-button>
        </div>
        <span>请先登录！</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const index = ref(false)
const router = useRouter()
let props = defineProps(['visible'])
// 定义 emits
const emit = defineEmits(['update:visible'])

// 关闭遮罩层
const handleClose = () => {
  // 触发 update:visible 事件，将 visible 的值设置为 false
  emit('update:visible', false)
}
const goLogin = () => {
  router.push('/login')
}
const goRegister = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.join-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .join-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    padding: 50px;
    border-radius: 5px;
    background-color: rgba($color: $bgc-color1, $alpha: 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.2);

    .title {
      min-width: 200px;
      max-width: 300px;
      height: 80px;
      transform-style: preserve-3d;
      perspective: 1000;
      perspective-origin: center;
      border-radius: 10px;
      background-color: #fff;
      z-index: 5;
      transition: all 0.6s cubic-bezier(0.4, -0.05, 0.75, 1.69);
      box-shadow: 20px 10px 15px rgba(0, 0, 0, 0.2); // 添加阴影

      .back,
      .front {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        h1 {
          font-weight: normal;
        }
      }
      .front {
        z-index: 2;
      }
      .back {
        z-index: 1;
        transform: rotateX(180deg);
      }
    }
    .join-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      span {
        color: $text-color3;
      }
    }
    .title-select {
      transform: rotateX(180deg);
    }
  }
}
</style>
