<template>
  <div class="box">
    <div class="corpper-container">
      <div>
        <vueCropper
          style="width: 200px; height: 200px"
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :full="option.full"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @realTime="handleCropChange"
        >
        </vueCropper>
      </div>
      <div class="change-view">
        <el-button
          size="small"
          v-show="fileList.length > 0"
          type="primary"
          plain
          @click="rotateLeft"
          >向左</el-button
        >
        <el-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
        >
          <template #trigger>
            <el-button size="small" type="primary">选择头像</el-button>
          </template>
        </el-upload>
        <el-button
          size="small"
          v-show="fileList.length > 0"
          type="primary"
          plain
          @click="rotateRight"
          >向右</el-button
        >
      </div>
    </div>
    <div class="box-left">
      <div class="Cropping-container">
        <img class="user-img-big" :src="imgUrl" style="width: 150px; height: 150px" />
        <img class="user-img-medium" :src="imgUrl" style="width: 80px; height: 80px" />
        <img class="user-img-small" :src="imgUrl" style="width: 40px; height: 40px" />
        <!-- <span>预览头像</span> -->
      </div>
      <div class="upload-container">
        <el-button
          size="small"
          :disabled="imgUrl && fileList.length === 0"
          type="primary"
          @click="uploadUserAvatar"
          >确认更改</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import vueCropper from '@/hooks/VueCropper'
import useCurrentInstance from '../hooks/useCurrentInstance'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadFile, UploadInstance } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const { proxy } = useCurrentInstance()
const imgUrl = ref('') // 预览图片
const cropper = ref()
const fileList = ref([] as UploadFile[]) // 选择上传的图片
const uploadRef = ref<UploadInstance>()
let option = reactive({
  img: '', // 裁剪图片的地址 url 地址, base64, blob
  outputSize: 1, // 裁剪生成图片的质量
  outputType: 'jpeg', // 裁剪生成图片的格式 jpeg, png, webp
  info: true, // 裁剪框的大小信息
  canScale: true, // 图片是否允许滚轮缩放
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 150, // 默认生成截图框宽度
  autoCropHeight: 150, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  fixed: true, // 是否开启截图框宽高固定比例，这个如果设置为true，截图框会是固定比例缩放的，如果设置为false，则截图框的宽高比例就不固定了
  fixedNumber: [1, 1], // 截图框的宽高比例 [ 宽度 , 高度 ]
  canMove: true, // 上传图片是否可以移动
  canMoveBox: false, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  full: false, // 是否输出原图比例的截图
  enlarge: '1', // 图片根据截图框输出比例倍数
  mode: 'cover' // 图片默认渲染方式 contain , cover, 100px, 100% auto
})
let messageInstance: any | null = null
// 处理裁剪框内容改变事件
const handleCropChange = () => {
  cropper.value.getCropData((data: any) => {
    imgUrl.value = data
  })
}
// 向左旋转90
const rotateLeft = () => {
  cropper.value.rotateLeft()
}

// 向右旋转90
const rotateRight = () => {
  cropper.value.rotateRight()
}

// 更新头像
const uploadUserAvatar = async () => {
  try {
    const fileName = fileList.value[fileList.value.length - 1].name
    // 将base64位的图片转化为file文件
    const image = base64ToFile(imgUrl.value, fileName) || null
    const size = image?.size
    const type = image?.type
    if (messageInstance) {
      messageInstance.close()
    }
    if (type !== 'image/jpeg' && type !== 'image/png') {
      messageInstance = ElMessage.error('只支持jpg、png格式图片')
      return false
    }
    if (size && size / 1024 / 1024 > 2) {
      messageInstance = ElMessage.error('图片大小不能超过10M')
      return false
    }
    const formData = new FormData()
    if (!image) {
      return false
    }
    formData.append('avatar', image)
    const result = await proxy.$http.uploadAvatar(formData)
    userStore.initUserInfo({ data: result.data })
    if (result.code === 200) messageInstance = ElMessage.success(result.message)
  } catch (error) {
    console.log(error)
  }
}

// el-upload的change事件
const handleChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
  try {
    if (!uploadFile) {
      // 用户取消了选择，不进行任何操作
      return
    }
    console.log(1)
    // 图片变成blob的数据，
    option.img = URL.createObjectURL(uploadFile.raw!)
  } catch (error) {
    console.log(error)
  }
}

const base64ToFile = (base64Data: string, filename: string): File | null => {
  // 分割 base64 数据，获取 mime 类型和数据部分
  const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

  // 检查是否匹配到正确的格式
  if (!matches || matches.length !== 3) {
    console.error('Invalid base64 string')
    return null
  }

  // 解码 base64 数据
  const [, mime, data] = matches
  const byteCharacters = atob(data)
  const byteNumbers = new Array(byteCharacters.length)

  // 将字符转换为字节
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  // 创建 Blob 对象
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: mime })

  // 创建 File 对象
  const file = new File([blob], filename, { type: mime })

  return file
}
onMounted(() => {
  imgUrl.value = userStore.userInfo.userImg
})
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px;

  .corpper-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    .change-view {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100%;
    }
  }

  .box-left {
    margin-left: 20px;
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;

    .Cropping-container {
      height: 150px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      overflow: hidden;
      gap: 20px;
      img {
        border-radius: 50%;
      }
      span {
        color: $text-color3;
      }
    }
  }
}
</style>
