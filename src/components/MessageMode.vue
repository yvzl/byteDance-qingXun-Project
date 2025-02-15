<script setup lang="ts">
import {useModel} from "@/hooks";
import {messageStore} from "@/stores"
import {Message, MessageOne} from '@icon-park/vue-next'
import Tooltip from "@/components/Tooltip.vue";

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
    <Tooltip content="更改内联或独立对话状态">
      <div @click="changeToInline" v-if="modeState" class="btn message-mode-1">
        <Message theme="outline" size="24"/>
      </div>
      <div @click="changeToChat" v-else class="btn message-mode-2">
        <MessageOne theme="outline" size="24"/>
      </div>
    </Tooltip>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageMode.module";
</style>