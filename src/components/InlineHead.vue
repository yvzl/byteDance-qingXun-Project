<script setup lang="ts">
import InlineClose from "@/components/InlineClose.vue";
import {useModel} from "@/hooks";

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(["update:modelValue"]);

const {modelValue} = props

const isExpanded = useModel(modelValue, props, "modelValue", emits, "update:modelValue")
</script>

<template>
  <div class="inline-head">
    <InlineClose @click="isExpanded = false"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InlineHead.module";
</style>