<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="title">
    <h1>{{ name }}</h1>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Title.module";
</style>