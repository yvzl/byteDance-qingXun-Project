<script setup lang="ts">
import type {FileObject} from "@coze/api";

defineProps<{
  file: FileObject
}>()
</script>

<template>
  <div class="file-list">
    <div class="file">{{ file.file_name }}</div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/FileList.module";
</style>