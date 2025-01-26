<script setup lang="ts">
import {Upload} from '@icon-park/vue-next'

const {size = 24} = defineProps<{ size?: number }>()
</script>

<template>
  <div class="upload">
    <Upload theme="outline" :size="size"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Upload.module";
</style>