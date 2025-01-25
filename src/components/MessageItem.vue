<!--MessageItem.vue-->
<script setup lang="ts">
import {md} from "@/utils"
import "github-markdown-css/github-markdown-dark.css"

defineProps<{value: string}>()
</script>

<template>
  <div v-html="md.render(value)" class="message-item markdown-body"></div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";
</style>