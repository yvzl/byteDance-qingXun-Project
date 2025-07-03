<script setup lang="ts">
import {debounce, LLM} from "@/utils";
import {storeToRefs} from "pinia";
import {messageStore} from "@/stores";
import {ref, computed, onMounted, onUnmounted, unref} from "vue";
import {botId, userId, pat} from "@/configs"
import Send from "@/components/Send.vue";
import TextArea from "@/components/TextArea.vue";
import Stop from "@/components/Stop.vue";

const emits = defineEmits(["beforeSend", "afterSend"])

const store = messageStore()
const {addContent, updateContent, changeRunning, changeStopRequest} = store
const {activeMessageId, runningState, stopRequest} = storeToRefs(store)

const value = defineModel<string>()
const response = ref<string>("")
const state = computed<boolean>(() => !(value?.value?.trim() === ""))
const contentId = ref<string>("")

const sendMsg = async () => {
  if(!state.value || runningState.value) return
  emits("beforeSend", async () => {
    const messageId = unref(activeMessageId.value)
    if(messageId === null) return
    await chatWithCoze(messageId)
  })
}

const chatWithCoze = async (messageId: string) => {
  changeStopRequest(new LLM({
    pat,
    botId,
    userId,
    content: value.value ?? "",
    conversationId: messageId,
    onCreated(id: string) {
      contentId.value = id
      addContent(messageId, {
        id,
        data: {
          user: value.value as string,
          chat: ""
        }
      })
      value.value = ""
      changeRunning(true)
    },
    onDelta(delta: string) {
      response.value += delta;
      updateContent(messageId, contentId.value, response.value);
    },
    onChatComplete() {
      emits("afterSend")
    },
    onFinally() {
      response.value = ""
      changeRunning(false)
    }
  }).stopRequest)
}

const keydownHandler = debounce(e => e.key === 'Enter' && !e.shiftKey && sendMsg(), 300)

onUnmounted(() => window.removeEventListener('keydown', keydownHandler))
onMounted(() => window.addEventListener('keydown', keydownHandler))
</script>

<template>
  <div class="input-box">
    <TextArea v-model="value" placeholder="请输入内容..." width="100%"/>
    <div>
      <Send v-if="!runningState" @click="sendMsg" :state="state && !runningState"/>
      <Stop @click="stopRequest()" v-else />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>