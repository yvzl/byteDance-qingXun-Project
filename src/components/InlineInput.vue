<script setup lang="ts">
import {Search} from "@icon-park/vue-next";
import {useModel} from "@/hooks";

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(["update:modelValue"]);

const {modelValue} = props

const isExpanded = useModel(modelValue, props, "modelValue", emits, "update:modelValue")
</script>

<template>
  <div class="inline-input" @click="isExpanded = true">
    <span>Search from this. . .</span>
    <Search :size="28"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InlineInput.module";
</style>