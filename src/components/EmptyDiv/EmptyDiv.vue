<template>
  <div class="empty"></div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.empty {
  transition: height 0.4s ease;
  /* 过渡效果 */
}

/* pc */
@media screen and (min-width: 960px) {
  .empty {
    height: 80px;
  }
}

/* ipad */
@media screen and (max-width: 960px) {
  .empty {
    height: 70px;
  }
}

/* android */
@media screen and (max-width: 750px) {
  .empty {
    height: 50px;
  }
}
</style>
