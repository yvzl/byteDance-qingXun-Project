<script setup lang="ts">
import HistoryMessage from "@/components/HistoryMessage.vue";
import CreateMessage from "@/components/CreateMessage.vue";
import Tools from "@/components/Tools.vue";
</script>

<template>
  <div class="side-bar">
    <Tools/>
    <CreateMessage/>
    <HistoryMessage/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/SideBar.module";
</style>