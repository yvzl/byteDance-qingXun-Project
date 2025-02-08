<script setup lang="ts">
import {useModel} from "@/hooks";
import {Message, MessageOne} from '@icon-park/vue-next'
import {messageStore} from "@/stores"

const {changeMainState} = messageStore()

const props = defineProps<{
  modelValue: boolean;
}>()

const {modelValue} = props
const emits = defineEmits(["update:modelValue"]);
const modeState = useModel(modelValue, props, "modelValue", emits, "update:modelValue")

const changeToInline = () => {
  changeMainState('inline')
  modeState.value = false
}
const changeToChat = () => {
  changeMainState('chat')
  modeState.value = true
}
</script>

<template>
  <div class="message-mode">
    <div @click="changeToInline" v-if="modeState" class="btn message-mode-1">
      <Message theme="outline" size="24" fill="#aab1bdff"/>
    </div>
    <div @click="changeToChat" v-else class="btn message-mode-2">
      <MessageOne theme="outline" size="24" fill="#aab1bdff"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageMode.module";
</style>