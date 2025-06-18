<script setup lang="ts">
import {messageStore} from "@/stores";

const {changeMessageId} = messageStore();
</script>

<template>
  <div class="create-message">
    <div @click="changeMessageId(null)">开启新对话</div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/CreateMessage.module";
</style>