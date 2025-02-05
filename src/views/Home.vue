<script setup lang="ts">
import DialogContainer from "@/components/DialogContainer.vue";
import SideBar from '@/components/SideBar.vue'
import Main from '@/components/Main.vue';

</script>

<template>
  <div class="home">
    <SideBar/>
    <DialogContainer />

    <Main/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Home.module";
</style>