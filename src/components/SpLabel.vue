<template>
  <div class="tags">
    <ul>
      <li v-for="(tag, index) in lbData" :key="index">
        <router-link
          :to="{ name: 'fine', query: { tag: tag } }"
          :style="{ fontSize: `${lbSize}px` }"
          >#{{ tag }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    lbData?: Array<string>
    lbSize?: number
  }>(),
  {
    lbSize: 16,
    lbData: () => ['图片', '分享']
  }
)
</script>

<style lang="scss" scoped>
.tags {
  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      margin-right: 10px;

      a {
        color: $text-color2;
      }
    }
  }
}
</style>
