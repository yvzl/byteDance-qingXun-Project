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
    <Transition name="tooltip">
      <div v-if="isVisible" class="tooltip-content" role="tooltip">{{ content }}</div>
    </Transition>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Tooltip.module";
</style>
  