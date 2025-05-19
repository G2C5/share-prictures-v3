<template>
  <div
    class="container"
    ref="container"
    @mouseleave="handleMouseleave"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseenter"
  >
    <div
      class="login-body"
      @mouseleave="handleMouseenter"
      @mouseenter="handleMouseleave"
      @mousemove.stop
    >
      <!-- 图片 -->
      <div class="login-img">
        <img src="../../public/images/Charlotte_1.jpg" alt="" />
      </div>
      <div class="login-right">
        <!-- 登录 -->
        <h1>登录</h1>
        <!-- 登录表单 -->
        <el-form ref="ruleFormRef" :model="loginData" label-width="auto" :rules="rules" status-icon>
          <el-form-item label="账号" class="input-style" prop="username">
            <el-input v-model="loginData.username" clearable placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" class="input-style" prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="loginData.password"
              :type="showPassword ? 'text' : 'password'"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item label="验证码" class="input-style" prop="captcha">
            <div class="flex">
              <div class="flexItem">
                <el-input
                  style="min-width: 70px"
                  v-model="loginData.captcha"
                  placeholder="请输入验证码"
                />
              </div>
              <div v-if="svgCode" class="captchaPanel" v-html="svgCode" @click="regCaptcha"></div>
              <div v-else @click="regCaptcha" class="captchaPanel">
                <el-button link>获取验证码</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="login-btn">
            <el-row style="width: 100%" :gutter="20">
              <el-col :span="10" :offset="15">
                <el-button style="width: 100%" @click="submitForm(ruleFormRef)"> 登录 </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <!--去注册 -->
        <div class="register-link">
          <span>没有账号？</span>
          <el-button link @click="goToRegister">去注册</el-button>
        </div>
      </div>
    </div>
    <div class="background" :style="{ backgroundPosition: backgroundPosition }"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import type { FormInstance, FormRules } from 'element-plus'
import type { LoginRuleFrom } from './types/types'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
import useCurrentInstance from '@/hooks/useCurrentInstance'
const { proxy } = useCurrentInstance()
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const userStore = useUserStore()
const svgCode = ref()
const loginData = reactive<LoginRuleFrom>({
  username: 'username',
  password: 'password',
  captcha: ''
})
const container = ref<HTMLElement | null>(null)
const newMouseX = ref(0)
const newMouseY = ref(0)
const useBgc = ref(false)
const showPassword = ref(false)
// 表单验证规则
const rules = reactive<FormRules<LoginRuleFrom>>({
  username: [
    { required: true, message: '登录账号不能为空！', trigger: 'blur' },
    { min: 6, max: 18, message: '登录账号长度应为6到18个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '登陆密码不能为空！', trigger: 'blur' },
    {
      required: true,
      message: '密码为6~18位字母、数字和符号',
      min: 6,
      max: 18,
      trigger: 'blur'
    }
  ],
  captcha: [
    { required: true, message: '验证码不能为空！', trigger: 'blur' }, // 验证码不能为空
    { pattern: /^[0-9A-Za-z]{4}$/, message: '请输入正确的验证码格式', trigger: 'blur' } // 验证码格式为4位数字
  ]
})
// 登录表单验证成功
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      try {
        console.log('submit')
        login()
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 登录
const login = async () => {
  try {
    const result = await proxy.$http.login(loginData)
    // 让仓库更新信息
    userStore.initUserInfo({ token: result.data.token, data: result.data.userInfo })
    ElMessage({
      showClose: true,
      message: result.message,
      type: 'success',
      duration: 6000
    })
    router.replace('/rank')
  } catch (error) {}
}
// 去注册
const goToRegister = () => {
  router.replace('/register')
}

// 验证码
const regCaptcha = async () => {
  try {
    const result = await proxy.$http.reqsvgCode()
    svgCode.value = result
  } catch (error) {
    console.log(error)
  }
}
const handleMouseleave = () => {
  useBgc.value = false
}
const handleMouseenter = () => {
  useBgc.value = true
}
const handleMouseMove = _.throttle((event: MouseEvent) => {
  if (!container.value) return ''
  const centerX = container.value.offsetWidth / 2
  const centerY = container.value.offsetHeight / 2
  newMouseX.value = (event.pageX - centerX) * 0.1
  newMouseY.value = (event.pageY - centerY) * 0.1
}, 100)
// 计算：视差距离
const backgroundPosition = computed(() => {
  if (useBgc.value) {
    return `${newMouseX.value}px ${newMouseY.value}px`
  }
  return '0px 0px'
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .login-body {
    width: 50%;
    height: 450px;
    box-shadow: 0 0 8px 2px #fff;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;

    /* 左边 */
    .login-img {
      width: 60%;

      > img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    /* 右边 */
    .login-right {
      position: relative;
      width: 40%;
      height: 100%;
      padding: 0 20px;
      background-color: rgba($color: $bgc-color1, $alpha: 0.67);
      backdrop-filter: blur(5px);
      .input-style {
        ::v-deep .el-form-item__label {
          color: $text-color1;
        }
        .flex {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          .flexItem {
            flex: 1;
          }
          .captchaPanel {
            max-width: 100px;
            min-width: 50px;
            width: 100px;
            height: 40px;
            padding-left: 10px;
          }
        }
      }

      h1 {
        width: 100%;
        color: $text-color1;
        text-align: center;
        padding: 30px 0 30px;
      }

      .register-link {
        position: absolute;
        bottom: 5px;
        right: 25px;
      }

      .register-link span {
        color: $text-color2;
        margin-bottom: 5px;
      }
    }
  }
  .background {
    position: absolute;
    perspective: 3px;
    transform: scale(1.2); /* 将背景放大 2.1 倍 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../public/images/Charlotte_1.jpg'); /* 背景图片的路径 */
    background-size: cover;
    transition: background-position 0.5s ease-out;
    z-index: 0;
  }
}

/* pc */
@media screen and (min-width: 960px) {
  .login-body {
    max-width: 60%;
    min-width: 800px;
  }
}

/* ipad */
@media screen and (max-width: 960px) {
  .container {
    .login-body {
      flex-direction: column;
      height: auto;

      .login-img,
      .login-right {
        width: 100%;
      }

      .login-img {
        height: 220px;
      }

      .login-right {
        padding: 2vw 5vw;

        h1 {
          padding: 5px 0 15px;
        }

        .register-link {
          right: 45px;
        }
      }
    }
  }
}

/* android */
@media screen and (max-width: 750px) {
  .container {
    .login-body {
      width: 85%;
      .login-right {
        .register-link {
          right: 30px;
        }
      }
    }
  }
}
</style>
