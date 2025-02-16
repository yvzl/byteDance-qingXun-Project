<script setup lang="ts">
import Tools from "@/components/Tools.vue";
import CreateMessage from "@/components/CreateMessage.vue";
import HistoryMessage from "@/components/HistoryMessage.vue";
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