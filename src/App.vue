<template>
  <!-- <test></test> -->
  <div class="container">
    <NavigationBar></NavigationBar>
    <Home></Home>
  </div>

  <!-- <router-view></router-view> -->
</template>

<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue';
import test from './components/test.vue';
import Home from './components/Home.vue';


</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>