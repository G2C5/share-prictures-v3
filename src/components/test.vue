<template>
  <div class="container">
    <p>内容</p>
    <button @mouseenter="startEnlarge" @mouseleave="startShrink">btn</button>
    <div ref="backgroundLayer" class="background-layer" :style="{ transform: scaleValue }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const scaleValue = ref("scale(1)");

const startEnlarge = () => {
  setTimeout(() => {
    scaleValue.value = "scale(0)";
  }, 500);
};

const startShrink = () => {
  setTimeout(() => {
    scaleValue.value = "scale(1)";
  }, 500);
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  z-index: 2;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0ee;
  z-index: -1;
  transition: transform 0.5s;
}
</style>
