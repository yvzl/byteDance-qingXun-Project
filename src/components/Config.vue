<script setup lang="ts">
import {ref} from "vue";
import {Config} from '@icon-park/vue-next';
import Tooltip from "@/components/Tooltip.vue";
import ChatConfig from "@/components/ChatConfig.vue";

const state = ref<boolean>(false)
</script>

<template>
  <div @click="state = true" class="config">
    <Tooltip content="自定义配置">
      <Config size="26"/>
    </Tooltip>
    <ChatConfig v-model="state"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Config.module";
</style>