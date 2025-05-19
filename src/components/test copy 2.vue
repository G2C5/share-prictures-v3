<template>
  <div>
    <EmptyDiv></EmptyDiv>
    <div v-if="!isExpanded" class="text-container" @click="toggleCollapse">
      <p>{{ text }}</p>
      <span class="expand-btn">展开</span>
    </div>
    <div v-else class="text-container expanded" @click="toggleCollapse">
      <p>{{ text }}</p>
      <span class="expand-btn">收起</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const text =
      'Your long text goes here...Your long text goes here...Your long text goes here...Your long text goes here...'
    const isExpanded = ref(false)

    const toggleCollapse = () => {
      isExpanded.value = !isExpanded.value
    }

    return {
      text,
      isExpanded,
      toggleCollapse
    }
  }
})
</script>

<style scoped>
.text-container {
  width: 300px;
  line-height: 1.5em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2; /* 控制显示的行数 */
  position: relative;
  transform: 0.3 ease;
}

.expanded {
  -webkit-line-clamp: unset; /* 显示全部内容 */
}

.expand-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
}
</style>
