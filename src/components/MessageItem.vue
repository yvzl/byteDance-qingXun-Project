<script setup lang="ts">
import {md} from "@/utils"
import "github-markdown-css/github-markdown-dark.css"
import {ContentType} from "@/types";

defineProps<{ value: string, type: ContentType }>()
</script>

<template>
  <div v-html="md.render(value)"
       :class="{'message-item': true, 'markdown-body': true, [ContentType[type]]: true}"></div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";
</style>