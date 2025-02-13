<script setup lang="ts">
import {md, debounce} from "@/utils";
import "github-markdown-css/github-markdown-dark.css";
import {ContentType} from "@/types";
import {onMounted, useTemplateRef, watch} from "vue";
import {Copy} from '@icon-park/vue-next'

const {value} = defineProps<{
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
    str.replaceAll(/<code class="(language-([a-z]+))">/g, `<button>复制</button><code class="$1">`);

onMounted(() => addCopyEvent());
watch(() => value, debounce(addCopyEvent));
</script>

<template>
  <div :class="['message-item', 'markdown-body', ContentType[type]]">
    <div class="md" ref="content" v-html="copyCode(md.render(value))"></div>
    <div class="tools" v-if="type === ContentType.assistant">
      <Copy @click="copy(value)" theme="outline" size="20" fill="#ccd3deff"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";
</style>