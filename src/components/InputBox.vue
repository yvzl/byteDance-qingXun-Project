<script setup lang="ts">
import {debounce, LLM} from "@/utils";
import {storeToRefs} from "pinia";
import {ContentType} from "@/types";
import {messageStore} from "@/stores";
import {ref, computed, onMounted} from "vue";
import Send from "@/components/Send.vue";
import TextArea from "@/components/TextArea.vue";

const store = messageStore()
const {addContent, getContentLength, updateContent} = store
const {activeMessageId} = storeToRefs(store)

const value = defineModel<string>()
const response = ref<string>("")
const state = computed<boolean>(() => /^\s*$/g.test(value?.value ?? ""))

const sendMsg = async () => {
  if(!value.value) return
  const id = getContentLength(activeMessageId.value) + 1 + ""
  addContent(activeMessageId.value, {
    id,
    role: ContentType.user,
    value: value.value,
  })
  await chatWithCoze()
}

const chatWithCoze = async () => LLM({
    url: "https://api.coze.cn/v3/chat",
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
    onCreated() {
      value.value = ""
      addContent(activeMessageId.value, {
        id: `${getContentLength(activeMessageId.value) + 1}`,
        role: ContentType.assistant,
        value: ""
      })
    },
    onDelta(delta: string) {
      response.value += delta;
      updateContent(response.value);
    },
    onChatComplete() {
      response.value = "";
    }
});

onMounted(() => window.addEventListener('keydown', debounce(e => e.key === 'Enter' && !e.shiftKey && sendMsg(), 500)))
</script>

<template>
  <div class="input-box">
    <TextArea v-model="value" placeholder="请输入内容..." width="100%"/>
    <Send @send="sendMsg" :state="state" :size="24" style="margin-left: 20px"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>