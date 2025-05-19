<template>
  <div class="update-info-container">
    <!-- 头像 -->
    <div class="user-avatar">
      <div class="user-header">我的头像</div>
      <ImgCorpper />
    </div>
    <div class="user-info">
      <div class="user-header">我的信息</div>
      <div class="user-info-content">
        <el-form
          ref="ruleFromRef"
          :model="uInfo"
          :rules="rules"
          tatus-icon
          :hide-required-asterisk="true"
          label-width="80px"
        >
          <el-form-item label="用户名称" prop="name">
            <el-input placeholder="请输入昵称" v-model="uInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="登陆账号">
            <span>{{ userInfo.username }}</span>
          </el-form-item>
          <el-form-item label="签名" prop="sign">
            <el-input
              v-model="uInfo.sign"
              type="textarea"
              :autosize="{ minRows: 4 }"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="login-btn">
              <el-button @click="submitForm(ruleFromRef)">确认修改</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { MyInfo } from '../../types/types'
import ImgCorpper from '@/components/ImgCorpper.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

import useCurrentInstance from '@/hooks/useCurrentInstance'
const userStore = useUserStore()
const { proxy } = useCurrentInstance()
const ruleFromRef = ref<FormInstance>()
const uInfo = reactive<MyInfo>({
  name: userStore.userInfo.name,
  sign: userStore.userInfo.sign
})
let messageInstance: any | null = null
const rules = reactive<FormRules<MyInfo>>({
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
  sign: [{ required: true, message: '不能为空', trigger: 'blur' }]
})
// 更新个人信息
const updateUserInfomation = async () => {
  try {
    if (messageInstance) {
      messageInstance.close()
    }
    const result = await proxy.$http.updateUserInfo(uInfo)
    messageInstance = ElMessage.success(result.message)
    userStore.initUserInfo({ data: result.data })
    console.log({ data: result.data })
  } catch (error) {
    console.log(error)
  }
}
// 表单验证成功
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      try {
        updateUserInfomation()
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const userInfo = computed(() => {
  return userStore.userInfo
})
</script>

<style lang="scss" scoped>
.update-info-container {
  width: 100%;
  height: 100%;
  .user-avatar {
    width: 100%;
    background-color: $bgc-color1;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .user-info {
    background-color: $bgc-color1;
    .user-info-content {
      padding: 20px 50px;
      .login-btn {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
.user-header {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px 20px;
  font-weight: bolder;
  background-color: $bgc-color2;
}
</style>
