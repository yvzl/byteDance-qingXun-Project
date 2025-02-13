<script setup lang="ts">
import {ref, computed, onMounted} from "vue"
import TextArea from "@/components/TextArea.vue";
import Upload from "@/components/Upload.vue";
import Send from "@/components/Send.vue";
import LLMInteraction from "@/utils/LLMInteraction";
import {CreateChatData, FileObject} from "@coze/api";
import {messageStore} from "@/stores";
import {storeToRefs} from "pinia";
import {ContentType} from "@/types";

const store = messageStore()
const {addContent, getContentLength, updateContent} = store
const {activeMessageId} = storeToRefs(store)

const value = ref<string>("")
const state = computed<boolean>(() => /^\s*$/g.test(value.value))
const fileInfo = ref<FileObject | undefined>(undefined)
const response = ref<any>(null)
const query = ref("你好");

const send = async () => {
  sendMsg()
  await chatWithCoze()
}
const uploadFile = async (childFileInfo: FileObject | undefined) => {
  fileInfo.value = childFileInfo;
  console.log(childFileInfo)
}
// 发送消息
const sendMsg = () => {
  const id = getContentLength(activeMessageId.value) + 1 + ""
  addContent(activeMessageId.value, {
    id,
    role: ContentType.user,
    value: value.value,
    fileInfo: fileInfo.value
  })
  query.value = value.value;// value放在inputArea，为了发送消息时清空输入框，这里保存query
  value.value = ""
  fileInfo.value = undefined; // 清空文件信息
}

// chat 答复
const chatWithCoze = async () => {
  try {
    await LLMInteraction.streamingChat({
      query: query.value,
      onUpdate: (delta: string) => {
        response.value = delta;
        updateContent(response.value);
      },
      onSuccess: (delta: string) => {
        response.value = delta;
      },
      onCreated: (data: CreateChatData) => {
        const id = `${getContentLength(activeMessageId.value) + 1}`
        addContent(activeMessageId.value, { //直接用创建对话表示
          id,
          role: ContentType.assistant,
          value: ""
        })
      },
    });

    if (response.value.trim() === "") return;
    /*
        const id = `${getContentLength(activeMessageId.value) + 1}`
        addContent(activeMessageId.value, { //这里流式打印完成的时候才会更新Content，导致AI不能做到流式回答
          id,
          role: ContentType.assistant,
          value: response.value
        })**/
  } catch (err) {
    console.error('API Error:', err);
  }
}

// enter键触发发送事件
const isSending = ref(false)
const debounceTimeout = ref<any | null>(null)

// 防抖发送方法
const debounceSend = () => {
  if (isSending.value) return
  isSending.value = true
  send().finally(() => {
    // 使用 setTimeout 保证最小间隔
    debounceTimeout.value = setTimeout(() => {
      isSending.value = false
      debounceTimeout.value = null
    }, 500) // 500ms 间隔
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  // 排除组合键和输入法状态
  if (e.isComposing || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return
  if (e.key === 'Enter' && !e.repeat) { // 检查 e.repeat 属性
    e.preventDefault()
    debounceSend()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="file-display" v-if="fileInfo">
    <div class="file-name">fileInfo.file_name: {{ fileInfo.file_name }}</div>
  </div>
  <div class="input-box">
    <TextArea v-model="value" placeholder="请输入内容..." width="100%"/>
    <!--v-model：将 value 绑定到 TextArea.vue 的 modelValue-->
    <Upload @uploadFile="uploadFile" :size="28" style="margin-left: 20px"/>
    <Send @send="send" :state="state" :size="24" style="margin-left: 20px"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>