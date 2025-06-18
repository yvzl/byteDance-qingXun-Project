<script setup lang="ts">
import {RoleType} from "@/types"
import {md, debounce, copy} from "@/utils";
import {onMounted, useTemplateRef, watch} from "vue";
import MessageTools from "@/components/MessageTools.vue";
import "github-markdown-css/github-markdown-dark.css";

const {value} = defineProps<{
  value: string
  type: RoleType
}>();

const content = useTemplateRef<HTMLDivElement>("content");

const addCopyEvent = () => {
  if (!content.value) return;
  content.value.querySelectorAll("pre").forEach((item: HTMLElement) => {
    const button = item.querySelector("div");
    if (!button) return
    button.addEventListener("click", () => item && copy(item.querySelector("code")?.innerText || ""));
  });
};

const copyCode = (str: string): string => str.replaceAll(/<code class="(language-([a-z]+))">/g, `<div>复制</div><code class="$1">`);

onMounted(() => addCopyEvent());
watch(() => value, debounce(addCopyEvent));
</script>

<template>
  <div :class="['message-item', 'markdown-body', type]">
    <div class="md" ref="content" v-html="copyCode(md.render(value))"></div>
    <MessageTools :value="value" v-if="type === RoleType.chat"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";
</style>