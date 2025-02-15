<script setup lang="ts">
import {coze} from "@/configs";
</script>

<template>
  <Teleport to="body">
    <div class="chat-config">
      <span>配置文件</span>
      <input :value="coze.url" placeholder="Base URL"/>
      <input :value="coze.botId" placeholder="Bot ID"/>
      <input :value="coze.pat" placeholder="PAT"/>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use "@/assets/styles/ChatConfig.module";
</style>