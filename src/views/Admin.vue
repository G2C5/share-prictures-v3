<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import { ElMessage } from 'element-plus'
const { proxy } = useCurrentInstance()
onMounted(() => {
  const result = proxy.$http.userlist()
  console.log(result)
})
</script>

<style scoped></style>
