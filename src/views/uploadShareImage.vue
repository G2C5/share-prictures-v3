<template>
  <div class="share-container">
    <div class="share-header"><h3>每一次分享，都让这个世界更加缤纷多彩！</h3></div>
    <div class="picture-info active">
      <el-form :hide-required-asterisk="true" :model="ruleForm" :rules="rules">
        <el-form-item label="图片">
          <div class="picture">
            <el-upload
              :class="{ hide: !(fileList.length < 5) }"
              ref="uploadRef"
              list-type="picture-card"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
              :multiple="true"
              :limit="5"
              :show-file-list="true"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full class="dialog-image" :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
          </div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <div class="picture-tags">
            <!-- 遍历标签 -->
            <div>
              <el-tag
                v-for="tag in ruleForm.tags"
                :key="tag"
                style="margin-right: 10px"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
                effect="light"
                round
              >
                {{ tag }}
              </el-tag>
            </div>
            <!-- 输入标签 -->
            <div class="picture-input-tags">
              <el-input
                v-if="inputVisible"
                v-show="ruleForm.tags.length <= 7"
                ref="InputRef"
                v-model="inputValue"
                size="small"
                type="text"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else size="small" @click="showInput">+标签</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="分享"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="share-button-container">
            <el-button plain @click="uploadShareImages"> 分享 </el-button>
          </div>
          <el-dialog v-model="centerDialogVisible" title="上传成功" width="500" center>
            <span> 继续分享？ </span>
            <template #footer>
              <div class="dialog-footer">
                <el-button type="primary" @click="goShareImageDetail"> 查看图片 </el-button>
                <el-button @click="goBack">继续分享</el-button>
              </div>
            </template>
          </el-dialog>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { RuleFrom } from './types/types'
import type { UploadFile } from 'element-plus'
import { ElInput, ElMessage } from 'element-plus'
import type { UploadInstance, UploadFiles, UploadUserFile, UploadProps } from 'element-plus'
import useCurrentInstance from '../hooks/useCurrentInstance'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
const router = useRouter()
const userStore = useUserStore()
const { proxy } = useCurrentInstance()
const uploadRef = ref<UploadInstance>()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const ruleForm = reactive<RuleFrom>({
  title: '',
  description: '',
  tags: []
})
const fileList = ref([] as File[]) // 图片
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const centerDialogVisible = ref(false) // 分享成功提示框
let messageInstance: any | null = null
const successImageInfo = ref<{ imageId: string }>()
// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { min: 2, max: 18, message: '标题长度应为2到18个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '图片描述不能为空！', trigger: 'blur' },
    {
      required: true,
      message: '图片描述应为3到200个字符',
      min: 3,
      max: 200,
      trigger: 'blur'
    }
  ]
})
// 上传图片:请求
const uploadShareImages = async () => {
  try {
    if (messageInstance) {
      messageInstance.close()
    }
    if (fileList.value.length === 0) {
      messageInstance = ElMessage.error('请选择上传文件')
      return
    }
    const formData = new FormData()
    formData.append('title', ruleForm.title)
    formData.append('description', ruleForm.description)
    formData.append('tags', ruleForm.tags.join(','))
    fileList.value.forEach((file) => formData.append('images', file))
    const result = await proxy.$http.uploadShareImage(formData)
    if (result.code === 200) {
      centerDialogVisible.value = true
      messageInstance = ElMessage.success('上传成功')
      uploadRef.value?.clearFiles()
      fileList.value = []
      successImageInfo.value = result.data
      const data = { uploadCount: result.data.uploadCount } || undefined
      // 更新用户数据
      userStore.initUserInfo({ data: data })
    } else {
      messageInstance = ElMessage.error('上传失败')
    }
  } catch (error) {
    console.error('上传失败', error)
  }
}
// 覆盖默认提交行为
const httpRequest = ({ file }: { file: File }) => {
  console.log('---------默认提交行为-----------')
  fileList.value?.push(file) // 将上传文件保存
}
// 上传图片之前
const beforeUpload = async (file: File) => {
  console.log('---------上传图片之前-----------')
  if (messageInstance) {
    messageInstance.close()
  }
  const { type, size } = file
  console.log(type, size)
  if (type !== 'image/jpeg' && type !== 'image/png') {
    messageInstance = ElMessage.error('只支持jpg、png格式图片')
    return false
  }
  if (size / 1024 / 1024 > 10) {
    messageInstance = ElMessage.error('图片大小不能超过10M')
    return false
  }
  return true
}
// 删除要上传的图片
const handleRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  const fileIndex = fileList.value.findIndex((file) => file === uploadFile.raw)
  if (fileIndex !== -1) {
    fileList.value.splice(fileIndex, 1)
  }
}
// 查看图片
const goShareImageDetail = () => {
  centerDialogVisible.value = false
  router.push({
    name: 'pictureDetali',
    query: { imageId: successImageInfo.value?.imageId, userId: userStore.userInfo._id }
  })
}
// 继续分享
const goBack = () => {
  centerDialogVisible.value = false
}
// 图片超出限制
const handleExceed = () => {
  ElMessage.error('最多上传5张图片')
}
// 删除标签
const handleClose = (tag: string) => {
  ruleForm.tags.splice(ruleForm.tags.indexOf(tag), 1)
}
// 更新输入标签
const showInput = () => {
  if (ruleForm.tags.length > 5) {
    return alert(8)
  }
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
// 输入标签
const handleInputConfirm = () => {
  if (inputValue.value) {
    ruleForm.tags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.share-container {
  width: 1224px;
  margin: 0 auto;
  margin-top: 10px;

  .share-header {
    width: 100%;
    height: 160px;
    animation: bganimation 15s infinite;
    background-size: 400%;
    overflow: hidden;
    background-image: linear-gradient(125deg, #e88, #8e8, #0ee);
    color: #fff;
    font-size: 23px;
    text-align: center;
    line-height: 160px;
    font-weight: 700;
    text-shadow: 2px 2px 11px;
    letter-spacing: 5px;
  }

  .picture-info {
    width: 100%;
    margin-top: 10xp;
    padding: 80px;

    background-color: $bgc-color1;

    .picture {
      background-color: $bgc-color1;
      ::v-deep .hide .el-upload--picture-card {
        display: none;
      }
      .dialog-image {
        width: 100%;
      }
    }
    .picture-tags {
      display: flex;
      gap: 20px;
    }
    .share-button-container {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
  @keyframes bganimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
}
</style>
