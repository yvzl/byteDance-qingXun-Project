<script setup lang="ts">
import Main from '@/components/Main.vue';
import SideBar from '@/components/SideBar.vue'
</script>

<template>
  <div class="home">
    <SideBar/>
    <Main/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Home.module";
</style>