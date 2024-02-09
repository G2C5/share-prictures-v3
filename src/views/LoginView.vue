<template>
  <div class="login-container">
    <div class="login-body">
      <!-- 图片 -->
      <div class="login-img">
        <img src="../../public/images/xCityAndNight.jpg" alt="">
      </div>
      <div class="login-right">
        <!-- 登录 -->
        <h1>登录</h1>
        <!-- 登录表单 -->
        <el-form :model="form" @submit.native.prevent="login" label-width="40px">
          <el-form-item label="账号">
            <el-input v-model="form.username" clearable />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" :type="showPassword ? 'text' : 'password'" show-password clearable />
          </el-form-item>
          <el-form-item class="login-btn">
            <el-button style="width: 100%;" type="primary" native-type="submit">登录</el-button>
          </el-form-item>
        </el-form>
        <!--注册 -->
        <div class="register-link">
          <span>没有账号？</span>
          <el-button type="text" @click="goToRegister">去注册</el-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
const form = reactive({
  username: 'username',
  password: 'password',
});
const showPassword = ref(false);
const login = () => {
  // Implement your login logic here
  console.log(form.username, form.password);
};
const goToRegister = () => {
  // Implement logic to navigate to the registration page or show the registration form
  console.log('Navigate to registration page');
};
</script>

<style lang="scss" scoped>
.login-container {
  margin: 0;
  height: 100vh;
  width: 100vw;
  background-color: #0ee;

  .login-body {
    width: 60%;
    height: 450px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .8);
    display: flex;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* 左边 */
    .login-img {
      width: 65%;

      >img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    /* 右边 */
    .login-right {
      width: 35%;
      height: 100%;
      padding: 0 30px;
      background-color: #fff;

      h1 {
        width: 100%;
        text-align: center;
        padding: 50px 0 40px;
      }

      .register-link {
        text-align: right;
        margin-top: 20px;
      }

      .register-link span {
        margin-bottom: 5px;
      }

    }
  }
}

/* pc */
@media screen and (min-width: 960px) {
  .login-body {
    max-width: 950px;
    min-width: 750px;
  }
}

/* ipad */
@media screen and (max-width: 960px) {
  .login-container {
    .login-body {
      flex-direction: column;
      height: auto;

      .login-img,
      .login-right {
        width: 100%;
      }

      .login-img {
        height: 200px;
      }

      .login-right {
        padding: 2vw 5vw;

        h1 {
          padding: 10px 0 30px;
        }

        .register-link {

          margin-top: 40px;
        }
      }
    }
  }
}

/* android */
@media screen and (max-width: 750px) {
  .login-container {
    .login-body {
      width: 85%;
    }
  }

}
</style>