<script setup lang="ts">
import {Send} from '@icon-park/vue-next';

const {size = 24} = defineProps<{ state: boolean, size?: number }>()
const emits = defineEmits(["send"])
</script>

<template>
  <div @click="!state && emits('send')" :class="{send: true, disable: state}">
    <Send theme="outline" :state=state :size="size"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Send.module";
</style>