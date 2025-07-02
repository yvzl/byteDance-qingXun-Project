<script setup lang="ts">
import {Send} from '@icon-park/vue-next';

defineProps<{ state: boolean}>()
</script>

<template>
  <div :class="{send: true, btn: true, active: state}">
    <Send theme="outline"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBoxBtn.module";
</style>