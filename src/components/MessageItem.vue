<script setup lang="ts">
import { md, debounce } from "@/utils";
import "github-markdown-css/github-markdown-dark.css";
import { ContentType } from "@/types";
import { onMounted, useTemplateRef, watch } from "vue";

const { value } = defineProps<{
  value: string;
  type: ContentType;
}>();

const content = useTemplateRef<HTMLDivElement>("content");

const addCopyEvent = () => {
  if (!content.value) return;
  content.value.querySelectorAll("code").forEach((item: HTMLElement) => {
    const button = item.previousElementSibling?.querySelector("button.copy-btn");
    if (button) {
      button.addEventListener("click", () => {
        const codeContent = item.textContent?.slice(0, -2) || "";
        copy(codeContent);
      });
    }
  });
};

const copy = (str: string) => {
  navigator.clipboard.writeText(str).then(() => {
    console.log("已复制到剪贴板");
  }).catch(err => {
    console.error("复制失败", err);
  });
}
const copyCode = (str: string): string =>
  str.replaceAll(/<code class="(language-([a-z]+))">/g, `<div style="position: relative;"><button 
  class="copy-btn" 
  style="  margin-left: 50px;
  position: absolute;
  right: 10px;
  color: grey;
  background: none;
  border: none;
  cursor: pointer;" >复制</button></div><code class="$1">`);

onMounted(() => addCopyEvent());
watch(() => value, debounce(addCopyEvent));
</script>

<template>
  <div :class="['message-item', 'markdown-body', ContentType[type]]">
    <div ref="content" v-html="copyCode(md.render(value))"></div>
    <button v-if="type === ContentType.assistant" @click="copy(value)">复制Markdown</button>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";

.copy-btn {
  margin-left: 50px;
  background: none;
  cursor: pointer;
  
}
</style>