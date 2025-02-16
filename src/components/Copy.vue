<script setup lang="ts">
import {Copy} from "@icon-park/vue-next";
import {copy} from "@/utils"
import Tooltip from "@/components/Tooltip.vue";

defineProps<{
  value: string;
}>()
</script>

<template>
  <div class="copy">
    <Tooltip content="复制">
      <Copy @click="copy(value)" theme="outline" size="20"/>
    </Tooltip>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Copy.module";
</style>