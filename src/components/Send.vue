<script setup lang="ts">
import {Send} from '@icon-park/vue-next'

const {size = 24} = defineProps<{ state: boolean, size?: number }>()
const emit = defineEmits(["send"])
</script>

<template>
  <div @click="!state && emit('send')" :class="{send: true, disable: state}">
    <Send theme="outline" :size="size"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Send.module";
</style>