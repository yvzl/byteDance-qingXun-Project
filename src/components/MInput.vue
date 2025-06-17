<script setup lang="ts">
withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false
})

const value = defineModel<string>()
</script>

<template>
  <div class="m-input">
    <input :disabled="disabled" v-model="value"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Input.module";
</style>