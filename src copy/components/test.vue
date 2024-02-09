<template>
  <div class="nav-none"></div>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- 左边：logo、导航、菜单 -->
      <div class="navbar-left">
        <!-- logo -->
        <div class="logo">
          <h2>
            <a href="/">logo</a>
          </h2>
        </div>
        <!-- 导航 -->
        <ul class="navbar-links" :class="{ 'show-menu': isMenuOpen }">
          <li><a href="">发现分享</a></li>
          <li><a href="">我想看看</a></li>
          <li><a href="">我的天地</a></li>
          <li><a href="">关于我们</a></li>
        </ul>
      </div>

      <!-- 右边：用户 -->
      <div class="navbar-right">
        <img v-if="!isLogin" src="../../public/images/cat.png" alt="">
        <a href="" v-if="isLogin">登录/注册</a>
        <!-- 隐藏菜单 -->
        <div class="menu-toggle" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const isMenuOpen = ref(false);
const isLogin = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style lang="scss" scoped>
// 占位
.nav-none {

  height: 70px;
  background-color: $bgc-color;
}

.navbar {
  width: 100vw;
  height: 70px;
  padding: 0 50px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: $bgc-color;
  backdrop-filter: blur(5px);
  border-bottom: 1px solid $bgc-color2;

  .navbar-container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navbar-left {
      display: flex;
      justify-content: center;
      align-items: center;

      .logo {
        h2 {
          margin-right: 40px;

          a {
            text-decoration: none;
            color: $text-color;
            font-size: 1.5rem;
            font-weight: bold;
          }
        }
      }


      .navbar-links {
        display: flex;
        gap: 20px;


        a {
          color: $text-color;
          letter-spacing: 2px;
          font-size: 1.1rem;
          font-weight: 700;
          transition: color 0.3s ease, text-shadow 0.3s ease;

          &:hover {
            color: $text-color-activity;
            text-shadow: 0 0 2px $text-color-activity;
          }
        }
      }

    }

    .navbar-right {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 78%;
        object-fit: cover;
        margin-right: 10px;
        border-radius: 50%;
        border: 2px solid $border-color;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          border-color: $border-color-activity;
          box-shadow: 0 0 4px 2px $text-color-activity;
        }
      }

      a {
        color: $text-color;
        font-size: 16px;
        font-weight: 700;
        background-color: $btn-color;
        padding: 10px;
        border-radius: 20px;
        border: 2px solid $border-color;
        transition: color 0.35s ease, border-color 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          color: $text-color-activity;
          background-color: $btn-color-select;
          border-color: $border-color-activity;
          box-shadow: 0 0 5px $text-color-activity;
        }
      }

      .menu-toggle {
        display: none;
        flex-direction: column;
        margin-left: 10px;
        border: 2px solid $border-color;
        border-right: none;
        border-radius: 0 0 25% 0;
        padding: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        /* 添加全局过渡 */

        span {
          background-color: $text-color;
          height: 1px;
          width: 25px;
          margin: 5px 0;
          display: block;
          transition: background-color 0.3s ease;
          /* 保留 span 的单独过渡 */
        }

        &:hover {
          border-color: $border-color-activity;
          box-shadow: 0 0 4px $text-color-activity;
          /* 阴影过渡 */

          span {
            background-color: $text-color-activity;
          }
        }
      }
    }
  }
}

// .navbar-links {
//   display: flex;
//   gap: 20px;
//   flex-direction: column;
//   position: fixed;
//   top: 0px;
//   left: 0;
//   width: 150px;
//   padding: 10px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//   border-radius: 0 0 5% 5%;
// }

@media screen and (max-width: 750px) {

  .menu-toggle {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    border: 2px solid $border-color;
    border-right: none;
    border-radius: 0 0 25% 0;
    padding: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    /* 添加全局过渡 */

    span {
      background-color: $text-color;
      height: 1px;
      width: 25px;
      margin: 5px 0;
      display: block;
      transition: background-color 0.3s ease;
      /* 保留 span 的单独过渡 */
    }

    &:hover {
      border-color: $border-color-activity;
      box-shadow: 0 0 4px $text-color-activity;
      /* 阴影过渡 */

      span {
        background-color: $text-color-activity;
      }
    }
  }

  .navbar-links {
    display: none;
    flex-direction: column;
    position: fixed;
    top: 60px;
    left: 0;
    width: 150px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 5% 5%;
    background-color: $bgc-color;
    backdrop-filter: blur(5px);

    li {
      padding: 4px;
      border-radius: 5%;

      a {
        margin-bottom: 10px;
      }
    }

    li:hover {
      background-color: $bgc-color;
    }

    &.show-menu {
      display: flex;
    }
  }
}
</style>
