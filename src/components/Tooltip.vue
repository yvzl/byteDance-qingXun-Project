<script setup lang="ts">
import {ref} from "vue";

defineProps<{
  content: string;
}>();

const isVisible = ref(false);

const showTooltip = () => isVisible.value = true;
const hideTooltip = () => isVisible.value = false;
</script>

<template>
  <div class="tooltip" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <div v-show="isVisible" class="tooltip-content">{{ content }}</div>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Tooltip.module";
</style>
  