<script setup lang="ts">
import {Config} from '@icon-park/vue-next'
import Tooltip from "@/components/Tooltip.vue";
</script>

<template>
  <div class="config">
    <Tooltip content="自定义配置">
      <Config size="26"/>
    </Tooltip>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Config.module";
</style>