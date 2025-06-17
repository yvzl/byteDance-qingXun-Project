<script setup lang="ts">
import {LLM} from "@/utils";
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

const query = ref("");
const isSending = ref(false)
const response = ref<any>(null)
const debounceTimeout = ref<any | null>(null)

const state = computed<boolean>(() => /^\s*$/g.test(value?.value ?? ""))

const send = async () => {
  sendMsg()
  await chatWithCoze()
}

const sendMsg = () => {
  if(!value.value) return
  const id = getContentLength(activeMessageId.value) + 1 + ""
  addContent(activeMessageId.value, {
    id,
    role: ContentType.user,
    value: value.value,
  })
  query.value = value.value;
  value.value = ""
}

const chatWithCoze = async () => {
  await LLM.streamingChat({
    query: query.value,
    onUpdate: (delta: string) => {
      response.value = delta;
      updateContent(response.value);
    },
    onSuccess: (delta: string) => {
      response.value = delta;
    },
    onCreated: () => {
      const id = `${getContentLength(activeMessageId.value) + 1}`
      addContent(activeMessageId.value, {
        id,
        role: ContentType.assistant,
        value: ""
      })
    },
  });
  if (response.value.trim() === "") return;
}

const debounceSend = () => {
  if (isSending.value) return
  isSending.value = true
  send().finally(() => {
    debounceTimeout.value = setTimeout(() => {
      isSending.value = false
      debounceTimeout.value = null
    }, 500)
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.isComposing || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return
  if (e.key === 'Enter' && !e.repeat) {
    e.preventDefault()
    debounceSend()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="input-box">
    <TextArea v-model="value" placeholder="请输入内容..." width="100%"/>
    <Send @send="send" :state="state" :size="24" style="margin-left: 20px"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>