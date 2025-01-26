<script setup lang="ts">
import {ref, computed} from "vue"
import TextArea from "@/components/TextArea.vue";
import Upload from "@/components/Upload.vue";
import Send from "@/components/Send.vue";
import LLMInteraction from "@/utils/impl/LLMInteraction";
import {CreateChatData} from "@coze/api";
import {messageStore} from "@/stores";
import {storeToRefs} from "pinia";

const store = messageStore()
const {updateContent, getContentLength} = store
const {messageId} = storeToRefs(store)

const value = ref<string>("")
const state = computed<boolean>(() => /^\s*$/g.test(value.value))

const response = ref<any>(null)
const query = ref("你好");

const send = async () => {
  sendMsg()
  await chatWithCoze()
}

// 发送消息
const sendMsg = () => {
  const id = getContentLength(messageId.value) + 1 + ""
  updateContent(messageId.value, {
    id,
    type: 0,
    value: value.value,
  })
  value.value = ""
}

// chat 答复
const chatWithCoze = async () => {
  try {
    await LLMInteraction.streamingChat({
      query: query.value,
      onUpdate: (delta: string) => {
        response.value = delta;
      },
      onSuccess: (delta: string) => {
        response.value = delta;
      },
      onCreated: (data: CreateChatData) => {
        console.log('Chat created:', data);
      },
    });

    if (response.value.trim() === "") return;

    const id = getContentLength(messageId.value) + 1 + ""
    updateContent(messageId.value, {
      id,
      type: 1,
      value: response.value
    })
  } catch (err) {
    console.error('API Error:', err);
  }
}
</script>

<template>
  <div class="input-box">
    <TextArea v-model="value" placeholder="请输入内容..." width="100%"/>
    <Upload :size="28" style="margin-left: 20px"/>
    <Send @send="send" :state="state" :size="24" style="margin-left: 20px"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>