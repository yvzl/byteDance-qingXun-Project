<script setup lang="ts">
import {debounce, LLM} from "@/utils";
import {storeToRefs} from "pinia";
import {messageStore} from "@/stores";
import {ref, computed, onMounted, onUnmounted, unref} from "vue";
import Send from "@/components/Send.vue";
import TextArea from "@/components/TextArea.vue";

const emits = defineEmits(["beforeSend", "afterSend"])

const store = messageStore()
const {addContent, updateContent, changeRunning} = store
const {activeMessageId, runningState} = storeToRefs(store)

const value = defineModel<string>()
const response = ref<string>("")
const state = computed<boolean>(() => !(value?.value?.trim() === ""))
const contentId = ref<string>("")

const sendMsg = async () => {
  if(!state.value || runningState.value) return
  changeRunning()
  emits("beforeSend", async () => {
    const messageId = unref(activeMessageId.value)
    if(messageId === null) return
    await chatWithCoze(messageId)
  })
}

const chatWithCoze = async (messageId: string) => LLM({
    url: `https://api.coze.cn/v3/chat?conversation_id=${messageId}`,
    query: {
      method: "POST",
      headers: {
        Authorization: "Bearer pat_8WQx7tAzEVlE812ldrdQJpkguRzUyhlNS49OPmzBNN8u1bgVH10CO6dfg59pnEYn",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bot_id: "7444887625741434921",
        stream: true,
        user_id: "7444880589150634021",
        auto_save_history: true,
        additional_messages: [{
          role: "user",
          content: value.value,
          content_type: "text"
        }]
      })
    },
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
    },
    onDelta(delta: string) {
      response.value += delta;
      updateContent(messageId, contentId.value, response.value);
    },
    onChatComplete() {
      emits("afterSend")
      response.value = "";
      changeRunning()
    }
});

const keydownHandler = debounce(e => e.key === 'Enter' && !e.shiftKey && sendMsg(), 300)

onUnmounted(() => window.removeEventListener('keydown', keydownHandler))
onMounted(() => window.addEventListener('keydown', keydownHandler))
</script>

<template>
  <div class="input-box">
    <TextArea v-model="value" placeholder="请输入内容..." width="100%"/>
    <Send @click="sendMsg" :state="(state && !runningState)" :size="24" style="margin-left: 20px"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>