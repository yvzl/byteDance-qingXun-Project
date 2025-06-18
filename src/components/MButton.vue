<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
withDefaults(defineProps<{
  value: string,
  type?: 'default' | 'primary',
  disabled?: boolean,
}>(), {
  type: 'default',
  disabled: false,
})
</script>

<template>
  <div class="m-button">
    <button :class="type" :disabled="disabled" type="button">{{ value }}</button>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MButton.module";
</style>