<script setup lang="ts">
import {More} from '@icon-park/vue-next'
import type {Message} from "@/types"

defineProps<{
  id: Message["id"]
}>()
</script>

<template>
  <More theme="outline" size="24" fill="white"/>
</template>

<style scoped lang="scss">
@use "@/assets/styles/More.module";
</style>