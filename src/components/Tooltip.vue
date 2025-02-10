<script setup lang="ts">
import { ref } from "vue";

interface Props {
  content: string;
}

// 内容
const props = defineProps<Props>();

const isVisible = ref(false);

// 显示 tooltip
const showTooltip = () => {
  isVisible.value = true;
};

// 隐藏 tooltip
const hideTooltip = () => {
  isVisible.value = false;
};
</script>

<template>
  <div class="tooltip" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <slot></slot>
    <div v-show="isVisible" class="tooltip-content">
      {{ props.content }}
    </div>
  </div>
</template>
  
<style scoped lang="scss">
@use "@/assets/styles/Tooltip.module";
</style>
  