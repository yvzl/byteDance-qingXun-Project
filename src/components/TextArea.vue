<script lang="ts" setup>
import {ref, watch, onMounted, useTemplateRef, type CSSProperties} from 'vue';

const props = defineProps<{
  placeholder?: string,
  width?: string,
  autoSize?: {
    minRows: number,
    maxRows: number
  }
}>();

const {placeholder = "", autoSize = {minRows: 2, maxRows: 10}} = props

const value = defineModel<string>()
const textAreaRef = useTemplateRef<HTMLTextAreaElement>("textAreaRef");
const textAreaStyle = ref<Partial<CSSProperties>>({});

const calcHeight = () => {
  const textArea = textAreaRef.value;
  if (!textArea) return;

  const {minRows, maxRows} = autoSize;
  const {fontSize, lineHeight, paddingTop, paddingBottom} = getComputedStyle(textArea)

  const _fontSize = parseInt(fontSize)
  const _lineHeight = parseInt(lineHeight) || _fontSize * 1.2;
  const _paddingTop = parseInt(paddingTop)
  const _paddingBottom = parseInt(paddingBottom)

  textArea.style.height = 'auto';
  const scrollHeight = textArea.scrollHeight;

  const minHeight = minRows * _lineHeight + _paddingTop + _paddingBottom;
  const maxHeight = maxRows * _lineHeight + _paddingTop + _paddingBottom;
  let height = scrollHeight < minHeight ? minHeight : scrollHeight > maxHeight ? maxHeight : scrollHeight
  textAreaStyle.value = {
    height: `${height}px`,
    overflow: scrollHeight > maxHeight ? 'auto' : 'hidden',
  };
};

watch(value, calcHeight);
onMounted(() => calcHeight());
</script>

<template>
  <div class="text-area" :style="{width: width}">
    <textarea
        ref="textAreaRef"
        v-model="value"
        :placeholder="placeholder"
        :style="textAreaStyle"
        @input="calcHeight"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/TextArea.module";
</style>