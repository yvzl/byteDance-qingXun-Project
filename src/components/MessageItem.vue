<script setup lang="ts">
import {md, copyCode, copy, debounce} from "@/utils";
import "github-markdown-css/github-markdown-dark.css";
import {ContentType} from "@/types";
import {onMounted, useTemplateRef, watch} from "vue";

const {value} = defineProps<{
  value: string;
  type: ContentType;
}>();

const content = useTemplateRef<HTMLDivElement>("content")

const addCopyEvent = () => {
  if (!content.value) return
  content.value.querySelectorAll("code").forEach((item: HTMLElement) => item.querySelector("div")?.addEventListener("click", () => copy(item.textContent?.slice(0, -2) || "")))
}

onMounted(() => addCopyEvent())
watch(() => value, debounce(addCopyEvent))
</script>

<template>
  <div :class="['message-item', 'markdown-body', ContentType[type]]">
    <div ref="content" v-html="copyCode(md.render(value))"></div>
    <button v-if="type === ContentType.assistant" @click="copy(value)">复制Markdown</button>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";
</style>