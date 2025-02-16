<script setup lang="ts">
import {ContentType} from "@/types";
import {md, debounce, copy} from "@/utils";
import {onMounted, useTemplateRef, watch} from "vue";
import MessageTools from "@/components/MessageTools.vue";
import "github-markdown-css/github-markdown-dark.css";

const {value} = defineProps<{
  value: string;
  type: ContentType;
}>();

const content = useTemplateRef<HTMLDivElement>("content");

const addCopyEvent = () => {
  if (!content.value) return;
  content.value.querySelectorAll("pre").forEach((item: HTMLElement) => {
    const button = item.querySelector("button");
    if (!button) return
    button.addEventListener("click", () => copy(item.textContent?.slice(0, -2) || ""));
  });
};

const copyCode = (str: string): string => str.replaceAll(/<code class="(language-([a-z]+))">/g, `<button>复制</button><code class="$1">`);

onMounted(() => addCopyEvent());
watch(() => value, debounce(addCopyEvent));
</script>

<template>
  <div :class="['message-item', 'markdown-body', ContentType[type]]">
    <div class="md" ref="content" v-html="copyCode(md.render(value))"></div>
    <MessageTools :value="value" v-if="type === ContentType.assistant"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";
</style>