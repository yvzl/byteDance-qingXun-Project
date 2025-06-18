<script setup lang="ts">
import {copy} from "@/utils"
import {Copy} from "@icon-park/vue-next";

defineProps<{
  value: string;
}>()
</script>

<template>
  <div class="message-tools">
    <div class="copy">
      <Copy @click="copy(value)"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageTools.module";
</style>