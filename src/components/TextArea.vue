<script lang="ts" setup>
import {useModel} from "@/hooks";
import {ref, watch, onMounted, useTemplateRef, type CSSProperties} from 'vue';

const props = defineProps<{
  modelValue: string,
  placeholder?: string,
  width?: string,
  autoSize?: {
    minRows: number,
    maxRows: number
  }
}>();

// update:modelValue：这是一个约定俗成的事件名称，当子组件需要更新父组件中的 v-model 绑定的值时，通常会触发这个事件，并传递新的值
const emit = defineEmits(["update:modelValue"]);

const {modelValue, placeholder = "", autoSize = {minRows: 2, maxRows: 5}} = props

const value = useModel(modelValue, props, "modelValue", emit, "update:modelValue") // 这里传入的 emit 是调用父组件的 update:modelValue，实现更新父组件的 v-model 绑定的值
const textAreaRef = useTemplateRef<HTMLTextAreaElement>("textAreaRef");
const textAreaStyle = ref<Partial<CSSProperties>>({});

// 根据 minRows 和 maxRows 计算文本域高度
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
    color: 'white',
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