<script setup lang="ts">
import {Send} from '@icon-park/vue-next';

const {size = 24} = defineProps<{ state: boolean, size?: number }>()
</script>

<template>
  <div :class="{send: true, active: state}">
    <Send theme="outline" :state=state :size="size"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Send.module";
</style>