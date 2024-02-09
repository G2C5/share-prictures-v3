<template>
  <div class="shell" ref="shell">
    <!-- slogan -->
    <div class="bgc-img one">
      <div class="slogan-mark" ref="backgroundLayer"></div>
      <div class="slogan lt" @mouseenter="setOpacity(0.4)" @mouseleave="setOpacity(1)">
        <h2>在<span><a href="#">发现</a></span>中分享<span>世界的美！</span></h2>
      </div>
      <div class="slogan rt" @mouseenter="setOpacity(0.4)" @mouseleave="setOpacity(1)">
        <h2>在<span><a href="#">分享</a></span>中发现<span>美的世界！</span></h2>
      </div>
    </div>
    <!-- one -->
    <div class="bgc-img two">
      <div class="type">
        <div class="type-one">one</div>
        <div class="type-two">two</div>
        <div class="type-three">three</div>
      </div>
    </div>
    <!-- two -->
    <div class="bgc-img three">
      <div class="content"></div>
    </div>
    <!-- three -->
    <div class="bgc-img four">
      <div class="content"></div>
    </div>
    <!-- footer -->
    <footer class="bgc-img five"></footer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const backgroundLayer = ref<HTMLElement | null>(null);

const setOpacity = (value: number) => {
  if (backgroundLayer.value) {
    backgroundLayer.value.style.opacity = value.toString();
  }
};

</script>

<style scoped lang="scss">
.shell {
  width: 100%;
  height: 100vh;
  perspective: 1px;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  transform-style: preserve-3d;

  .bgc-img {
    width: 100%;
    height: 100vh;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    z-index: -1;
  }

  .one {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url('../../public/images/Charlotte_1.png');
    box-shadow: 0 0 10px $bgc-color;

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

    .slogan {
      display: flex;
      align-items: center;

      h2 {
        color: $text-color-rever;
        text-shadow: 0 0 2px $text-color;
        letter-spacing: 10px;
        border-bottom: none;

        span,
        a {
          color: $text-color-rever;
          border-bottom: 2px solid $text-color-rever;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }

        span {
          letter-spacing: 5px;
          font-size: 1.5em;
          border-bottom: none;
        }
      }
    }

    .lt {
      line-height: 70px;
      padding-left: 50px;
      color: #0ee;
      transition: color 0.5s;
    }

    .rt {
      line-height: 70px;
      padding-right: 50px;
    }


    /* 添加过渡效果 */
    // &:before {
    //   background-image: -moz-linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
    //   background-image: -webkit-linear-gradient(top, rgba(23, 24, 32, 0.75), rgb(85 85 85 / 65%));
    //   background-image: -ms-linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
    //   background-image: linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
    //   content: '';
    //   display: block;
    //   position: absolute;
    //   width: 100%;
    //   height: 100%;
    //   top: 0;
    //   right: 0;
    //   box-shadow: 0 12px 150px 10px $bgc-color;
    //   transition: opacity 0.5s;
    //   z-index: -1;
    // }
  }


  .two {
    background-image: url('../../public/images/Charlotte_2.png');
    left: 0;
    top: 0;
    transform: translateZ(-2px) scale(3.1);

    z-index: -2;

    .type {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      height: 35%;
      background-color: $bgc-color;
      border-top: solid 10px $bgc-color2;
      position: fixed;
      left: 0;
      bottom: 0;


      .type-one,
      .type-two,
      .type-three {
        margin-bottom: 20vh;
        padding: 10px;
        background-color: $bgc-color2;
      }
    }
  }

  .three {
    box-shadow: 0 0 10px $bgc-color;
    background-image: url('../../public/images/Charlotte_3.png');

    .content {
      position: absolute;
      width: 30%;
      height: 100%;
      background-color: $bgc-color;
      top: 0;
      left: 0;
      border-right: 10px solid $bgc-color2;
    }
  }

  .four {
    background-image: url('../../public/images/Charlotte_4.png');
    transform: translateZ(-1px) translateY(50px) scale(2.1);
    position: relative;
    z-index: -2;

    .content {
      position: absolute;
      width: 30%;
      height: 100%;
      background-color: $bgc-color;
      top: 0;
      right: 0;
      border-left: 10px solid $bgc-color2;
    }
  }

  .five {
    box-shadow: 0 0 10px $bgc-color;
    background-image: url('../../public/images/Charlotte_5.png');
  }
}

/* pc */
@media screen and (min-width: 960px) {}

/* ipad */
@media screen and (max-width: 960px) {
  .shell {
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
    .bgc-img {
      .content {
        width: 100%;
        height: 50%;
        top: auto;
        bottom: 0;
      }
    }

    .one {
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
            border-right: 2px solid $text-color-rever;
            border-bottom: 2px solid $text-color-rever;
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
