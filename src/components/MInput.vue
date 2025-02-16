<script setup lang="ts">
import {useModel} from "@/hooks";

const props = withDefaults(defineProps<{
  modelValue: string
  disabled?: boolean
}>(), {
  disabled: false
})

const emits = defineEmits(["update:modelValue"])

const {modelValue} = props

const value = useModel(modelValue, props, "modelValue", emits, "update:modelValue")
</script>

<template>
  <div class="m-input">
    <input :disabled="disabled" v-model="value"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Input.module";
</style>