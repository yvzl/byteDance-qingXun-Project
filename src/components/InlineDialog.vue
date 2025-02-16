<script setup lang="ts">
import {useModel} from "@/hooks";
import {Close} from "@icon-park/vue-next";
import Main from "@/components/Main.vue";

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(["update:modelValue"]);

const {modelValue} = props

const isExpanded = useModel(modelValue, props, "modelValue", emits, "update:modelValue")
</script>

<template>
  <div class="inline-dialog">
    <div class="head">
      <Close @click="isExpanded = false" theme="outline" size="24" fill="white"/>
    </div>
    <Main/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InlineDialog.module";
</style>