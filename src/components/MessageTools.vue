<script setup lang="ts">
import Copy from "@/components/Copy.vue";

defineProps<{
  value: string;
}>()
</script>

<template>
  <div class="message-tools">
    <Copy :value="value"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageTools.module";
</style>