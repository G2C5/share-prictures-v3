<template>
  <div
    class="container"
    ref="container"
    @mouseleave="handleMouseleave"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseenter"
  >
    <div
      class="register-body"
      @mouseleave="handleMouseenter"
      @mouseenter="handleMouseleave"
      @mousemove.stop
    >
      <!-- 图片 -->
      <div class="register-img">
        <img src="../../public/images/register.jpg" alt="" />
      </div>
      <div class="register-right">
        <!-- 注册 -->
        <h1>注册</h1>
        <!-- 注册表单 -->
        <el-form :model="regData" ref="ruleFormRef" label-width="auto" :rules="rules" status-icon>
          <el-form-item label="用户名" class="input-style" prop="name">
            <el-input v-model="regData.name" clearable placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="登录账号" class="input-style" prop="username">
            <el-input v-model="regData.username" clearable placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="登录密码" class="input-style" prop="password">
            <el-input
              v-model="regData.password"
              :type="showPassword ? 'text' : 'password'"
              show-password
              clearable
              placeholder="请输入密码"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="确认密码" class="input-style" prop="password2">
            <el-input
              v-model="regData.password2"
              :type="showPassword ? 'text' : 'password'"
              show-password
              clearable
              placeholder="请再次输入密码"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="验证码" class="input-style" prop="captcha">
            <div class="flex">
              <div class="flexItem">
                <el-input
                  style="min-width: 70px"
                  v-model="regData.captcha"
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
                <el-button
                  style="width: 100%"
                  type="primary"
                  color="$bgc-color2"
                  @click="submitForm(ruleFormRef)"
                  >注册</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <!--去登录 -->
        <div class="login-link">
          <span>已有账号？</span>
          <el-button @click="goToRegister" link>去登录</el-button>
        </div>
      </div>
    </div>
    <div class="background" :style="{ backgroundPosition: backgroundPosition }"></div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { RegisterRuleFrom } from './types/types'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import _ from 'lodash'
const { proxy } = useCurrentInstance()
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const showPassword = ref(false)
// 用户信息
const regData = reactive<RegisterRuleFrom>({
  name: 'user',
  username: 'username',
  password: 'password',
  password2: 'password',
  captcha: ''
})
const container = ref<HTMLElement | null>(null)
const newMouseX = ref(0)
const newMouseY = ref(0)
const svgCode = ref()
const useBgc = ref(false)
// 表单验证规则
const rules = reactive<FormRules<RegisterRuleFrom>>({
  name: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 3, max: 7, message: '由3~7个字符组成', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
      message: '只能使用特殊符号 _',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]/,
      message: '只能数字、字母或汉字开头',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
      message: '由数字、字母、汉字和下划线组成',
      trigger: 'blur'
    }
  ],
  username: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 6, max: 18, message: '由6~18个字符组成', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/,
      message: '必须由字母和数字组成',
      trigger: 'blur'
    },
    {}
  ],
  password: [
    { required: true, message: '登陆密码不能为空', trigger: 'blur' },
    {
      required: true,
      message: '由6~18个字符组成',
      min: 6,
      max: 18,
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
      message: '必须包含数字和字母',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z\d!@#$%^&*()_+]+$/,
      message: '只能使用特殊字符!@#$%^&*()_+',
      trigger: 'blur'
    },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (value === regData.username) {
          callback(new Error('密码不能和账号一致'))
        } else {
          callback()
        }
      }
    },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (value === regData.name) {
          callback(new Error('密码不能和用户名一致'))
        } else {
          callback()
        }
      }
    }
  ],
  password2: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (value !== regData.password) {
          callback(new Error('密码不一致'))
        } else {
          callback()
        }
      }
    }
  ],
  captcha: [
    { required: true, message: '验证码不能为空！', trigger: 'blur' }, // 验证码不能为空
    { pattern: /^[0-9A-Za-z]{4}$/, message: '请输入正确的验证码格式', trigger: 'blur' } // 验证码格式为4位数字
  ]
})

// 去登录
const goToRegister = () => {
  router.replace('/login')
}
// 注册表单验证成功
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      try {
        console.log('submit')
        register()
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 注册业务
const register = async () => {
  try {
    const result = await proxy.$http.register({
      name: regData.name,
      username: regData.username,
      password: regData.password,
      captcha: regData.captcha
    })

    ElMessage({
      showClose: true,
      message: result.message,
      type: 'success',
      duration: 2000
    })

    router.push({
      name: 'login'
    })
  } catch (error) {
    console.error('注册失败:', error)
  }
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

  .register-body {
    width: 50%;
    height: 450px;
    border-radius: 10px;
    box-shadow: 0 0 8px 2px #fff;
    overflow: hidden;
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;

    /* 左边 */
    .register-img {
      width: 60%;

      > img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    /* 右边 */
    .register-right {
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

      .login-link {
        text-align: right;
        margin-top: 20px;
      }

      .login-link span {
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
    background-image: url('../../public/images/register.jpg');
    background-size: cover;
    transition: background-position 0.5s ease-out;
    z-index: 0;
  }
}

/* pc */
@media screen and (min-width: 960px) {
  .register-body {
    max-width: 60%;
    min-width: 800px;
  }
}

/* ipad */
@media screen and (max-width: 960px) {
  .container {
    .register-body {
      flex-direction: column;
      height: auto;

      .register-img,
      .register-right {
        width: 100%;
      }

      .register-img {
        height: 220px;
      }

      .register-right {
        padding: 2vw 5vw;

        h1 {
          padding: 5px 0 15px;
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
  .container {
    .register-body {
      width: 85%;
    }
  }
}
</style>
