<script setup lang="ts">
import {useModel} from "@/hooks";
import {storeToRefs} from "pinia";
import {ContentType} from "@/types";
import {FileObject} from "@coze/api";
import {messageStore} from "@/stores";
import {ref, computed, onMounted} from "vue";
import Send from "@/components/Send.vue";
import Upload from "@/components/Upload.vue";
import TextArea from "@/components/TextArea.vue";
import LLMInteraction from "@/utils/LLMInteraction";

const props = defineProps<{
  value: string
  file: FileObject | undefined
}>()

const emits = defineEmits(["update:value", "update:file"]);

const store = messageStore()
const {addContent, getContentLength, updateContent} = store
const {activeMessageId} = storeToRefs(store)

const {value: _value, file: _file} = props

const file = useModel(_file, props, "file", emits, "update:file")
const value = useModel(_value, props, "value", emits, "update:value")

const query = ref("");
const isSending = ref(false)
const response = ref<any>(null)
const debounceTimeout = ref<any | null>(null)

const state = computed<boolean>(() => /^\s*$/g.test(value.value))

const send = async () => {
  sendMsg()
  await chatWithCoze()
}

const uploadFile = async (childFileInfo: FileObject | undefined) => file.value = childFileInfo;

// 发送消息
const sendMsg = () => {
  const id = getContentLength(activeMessageId.value) + 1 + ""
  addContent(activeMessageId.value, {
    id,
    role: ContentType.user,
    value: value.value,
    fileInfo: file.value
  })
  query.value = value.value;// value放在inputArea，为了发送消息时清空输入框，这里保存query
  value.value = ""
  file.value = undefined; // 清空文件信息
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
      onCreated: () => {
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
        addContent(activeMessageId.value, { // 这里流式打印完成的时候才会更新 Content，导致 AI 不能做到流式回答
          id,
          role: ContentType.assistant,
          value: response.value
        })**/
  } catch (err) {
    console.error('API Error:', err);
  }
}

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
  <div class="input-box">
    <TextArea v-model="value" placeholder="请输入内容..." width="100%"/>
    <Upload @uploadFile="uploadFile" :size="28" style="margin-left: 20px"/>
    <Send @send="send" :state="state" :size="24" style="margin-left: 20px"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>