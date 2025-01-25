<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<template>
  <div class="head">
    <img :src="src" alt="head"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Head.module";
</style>