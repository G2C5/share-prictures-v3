<template>
  <div class="shell" ref="shell">
    <!-- slogan -->
    <div class="bgc-img one" data-index="0">
      <div class="slogan-mark" ref="backgroundLayer"></div>
      <div class="slogan-container">
        <div class="slogan lt" @mouseenter="setOpacity(0.4)" @mouseleave="setOpacity(1)">
          <h2>
            在<span><a href="javascript:;" @click.prevent="userLogin(1)">发现</a></span
            >中分享<span>世界的美！</span>
          </h2>
        </div>
        <div class="slogan rt" @mouseenter="setOpacity(0.4)" @mouseleave="setOpacity(1)">
          <h2>
            在<span><a href="#" @click.prevent="userLogin(2)">分享</a></span
            >中发现<span>美的世界！</span>
          </h2>
        </div>
      </div>
    </div>
    <div class="bgc-img two" data-index="1">
      <div class="content" :class="{ 'two-visible': showContentIndex[1] }">
        <div class="two-text">
          <h2>在这里展现万千世界</h2>
          <div>一千个读者就有一千个哈姆雷特，一千个独特的视角就有一千个世界</div>
          <div>在这里</div>
          <div>每个人都可以发现</div>
          <div>每个人都可以分享</div>
        </div>
      </div>
    </div>
    <!-- three -->
    <div class="bgc-img three" data-index="2">
      <div class="content" :class="{ 'three-visible': showContentIndex[2] }">
        <div class="text">
          <h2>也许你能发现</h2>
          <p>
            在不停寻找橡皮擦的人，回头也可能忘记手里的握住的铅笔，我们始终相信，也许就是你能发现我们遗忘的铅笔。
          </p>
        </div>
        <div class="go-action">
          <h2 @click.prevent="userLogin(1)">去发现</h2>
        </div>
      </div>
    </div>
    <!-- four -->
    <div class="bgc-img four" data-index="3">
      <div class="content" :class="{ 'four-visible': showContentIndex[3] }">
        <div class="text">
          <h2>只有你能分享</h2>
          <p>
            世界上没有两片相同的树叶，我们信息你的分享独一无二，每一次分享，都点缀出绚烂多次的世界
          </p>
        </div>
        <div class="go-action">
          <h2 @click.prevent="userLogin(2)">去分享</h2>
        </div>
      </div>
    </div>
    <!-- five -->
    <!-- <footer class="bgc-img five" data-index="4"></footer> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
const router = useRouter()
const userStore = useUserStore()
const showContentIndex = ref<Array<boolean>>([])
const backgroundLayer = ref<HTMLElement | null>(null)
const shell = ref<HTMLElement | null>(null)
// 监视触发事件
const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    const dataIndex = Number(entry.target.getAttribute('data-index'))
    // 检查元素是否进入视口60%
    if (entry.isIntersecting) {
      showContentIndex.value[dataIndex] = true // 展示内容
    } else {
      showContentIndex.value[dataIndex] = false // 隐藏内容
    }
  })
}

// 监视 .shell 元素的全部子元素
const observeElements = () => {
  const options = {
    root: null, // 观察者所在的根元素（视口），null：整个视口
    threshold: 0.65 // 元素可见度达到80%时触发回调函数
  }

  // 创建一个 IntersectionObserver 实例
  const observer = new IntersectionObserver(intersectionCallback, options)
  // 观察 .shell 元素的所有直接子元素
  const children = shell.value?.children
  if (children) {
    Array.from(children).forEach((child) => {
      observer.observe(child)
      showContentIndex.value.push(false)
    })
  }
}

// 主页遮罩层透明度
const setOpacity = (value: number) => {
  if (backgroundLayer.value) {
    backgroundLayer.value.style.opacity = value.toString()
  }
}
// 去发现、去分享：跳转登录注册
const userLogin = async (mode: number) => {
  if (!userStore.loginInfo.isLogin) {
    router.push({ name: 'login' })
  } else {
    if (mode === 1) {
      router.push({ name: 'fine' })
    } else {
      router.push({ name: 'share' })
    }
  }
}

// 初始化监视
onMounted(() => {
  if (shell.value) {
    observeElements() // 在组件挂载后开始监视元素
  }
})
</script>

<style scoped lang="scss">
.shell {
  width: 100%;
  height: calc(100vh - 80px);
  perspective: 1px;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  transform-style: preserve-3d;
  transition: height 0.3s ease;

  .bgc-img {
    width: 100%;
    height: 100vh;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    z-index: -1;
  }

  /* 内容背景 */
  .two,
  .three,
  .four,
  .five {
    .content {
      backdrop-filter: blur(5px);
      @include bgc-color('bgc-color1', 0.67);
      overflow: hidden;
      opacity: 0;
      transition:
        opacity 0.5s ease,
        transform 0.5s ease;
    }
  }

  .one {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url('../../public/images/Charlotte_1.jpg');
    // box-shadow: 0 0 10px $bgc-color2;
    @include box-shadow(0, 0, 10, 0, 'shadow-color2');

    .slogan-mark {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: -moz-linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
      background-image: -webkit-linear-gradient(top, rgba(23, 24, 32, 0.75), rgb(85 85 85 / 65%));
      background-image: -ms-linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
      background-image: linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
      opacity: 1;
      transition: all 0.5s;
      z-index: -1;
    }

    .slogan-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .slogan {
        display: flex;
        align-items: center;

        h2 {
          @include color('font-color-rever1');
          // color: $text-color-rever1;
          // text-shadow: 0 0 2px $text-color1;
          @include text-shadow(0, 0, 2, 'font-color-rever2');
          letter-spacing: 10px;
          border-bottom: none;

          span,
          a {
            // color: $text-color-rever1;
            @include color('font-color-rever1');
            // border-bottom: 2px solid $text-color-rever1;
            @include border(2, solid, 'bgc-color1', bottom);
            // text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
            @include text-shadow(0, 0, 4, 'font-color-rever2');
          }

          span {
            letter-spacing: 5px;
            font-size: 1.5em;
            border-bottom: none;
          }
        }
      }
    }

    .lt {
      line-height: 70px;
      padding-left: 50px;
      transition: color 0.5s;
    }

    .rt {
      line-height: 70px;
      padding-right: 50px;
    }
  }

  .two {
    background-image: url('../../public/images/Charlotte_2.jpg');
    left: 0;
    top: 0;
    transform: translateZ(-2px) scale(3.1);
    z-index: -2;

    .content {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 35%;
      @include border(10, solid, 'bgc-color1', top);
      position: fixed;
      left: 0;
      bottom: 0;
      transform: translateY(100%);
    }
    .two-visible {
      opacity: 1;
      transform: translateY(0); /* 向上位移到容器顶部 */
    }
    .two-text {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px;
      @include color('font-color-rever1');
    }
  }

  .three {
    @include box-shadow(0, 0, 10, 0, 'shadow-color2');
    background-image: url('../../public/images/Charlotte_3.jpg');

    .content {
      position: absolute;
      top: 0;
      right: 0;
      width: 30%;
      height: 100%;
      padding: 100px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      @include border(10, solid, 'bgc-color1', left);
      transform: translateX(100%);
      .text {
        h2 {
          padding: 50px;
          @include border(2, solid, 'bgc-color1', bottom);
        }
        p {
          padding: 20px 5px;
          text-indent: 2em;
          text-align: left;
          line-height: 1.5em;
          font-size: 18px;
        }
      }
      .go-action {
        width: 50%;
        border-radius: 50px;
        @include bgc-color('bgc-color3', 1);

        cursor: pointer;
        h2 {
          font-size: 16px;
          padding: 10px 0;
          font-weight: normal;
        }
      }
    }
    .three-visible {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .four {
    background-image: url('../../public/images/Charlotte_4.jpg');
    transform: translateZ(-1px) translateY(50px) scale(2.1);
    position: relative;
    z-index: -2;

    .content {
      position: absolute;
      width: 30%;
      height: 100%;
      padding: 120px 20px 120px 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      top: 0;
      left: 0;
      @include border(10, solid, 'bgc-color1', right);
      transform: translateX(-100%);

      .text {
        h2 {
          padding: 50px;
          @include border(2, solid, 'bgc-color1', bottom);
        }
        p {
          padding: 20px 5px;
          text-indent: 2em;
          text-align: left;
          line-height: 1.5em;
        }
      }
      .go-action {
        font-weight: normal;
        width: 50%;
        border-radius: 50px;
        @include bgc-color('bgc-color3', 1);
        h2 {
          font-size: 16px;
          font-weight: normal;
          padding: 10px 0;
        }
      }
    }
    .four-visible {
      opacity: 1; /* 显示内容时透明度为 1 */
      transform: translateX(0);
    }
  }

  .five {
    box-shadow: 0 0 10px $bgc-color1;
    background-image: url('../../public/images/Charlotte_5.jpg');
  }
}

/* pc */
@media screen and (min-width: 960px) {
}

/* ipad */
@media screen and (max-width: 960px) {
  .shell {
    height: calc(100vh - 70px);

    .two {
      .type {
        height: 45vh;
      }
    }

    .three {
      .content {
        width: 45%;
      }
    }

    .four {
      .content {
        width: 45%;
      }
    }
  }
}

/* android */
@media screen and (max-width: 750px) {
  .shell {
    height: calc(100vh - 50px);
    .bgc-img {
      .content {
        width: 100%;
        height: 50%;
        top: auto;
        bottom: 0;
      }
    }

    .one {
      .slogan-container {
        flex-direction: row;

        .slogan {
          writing-mode: vertical-rl;
          /* 设置文字的排列方式为垂直从右到左 */
          text-orientation: upright;

          /* 设置文字的方向为直立 */
          // transform: rotate(180deg);
          h2 {
            padding-top: 5px;

            span,
            a {
              border-bottom: none;
              border-right: 2px solid $text-color-rever1;
              border-bottom: 2px solid $text-color-rever1;
            }
          }
        }
      }

      .lt {
        padding-bottom: 50px;
      }

      .rt {
        padding-top: 50px;
      }
    }

    .two {
      .type {
        height: 50vh;
      }
    }

    .three {
      .content {
        border-right: none;
        border-top: 10px solid $bgc-color2;
      }
    }

    .four {
      .content {
        left: 0;
        border-left: none;
        border-top: 10px solid $bgc-color2;
      }
    }
  }
}
</style>
