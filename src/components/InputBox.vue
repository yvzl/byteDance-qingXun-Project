<script setup lang="ts">
import {ref, computed, onMounted} from "vue"
import TextArea from "@/components/TextArea.vue";
import Upload from "@/components/Upload.vue";
import Send from "@/components/Send.vue";
import LLMInteraction from "@/utils/impl/LLMInteraction";
import {CreateChatData, FileObject} from "@coze/api";
import {messageStore} from "@/stores";
import {storeToRefs} from "pinia";
import {ContentType, type Content} from "@/types";

const store = messageStore()
const {updateContent, getContentLength} = store
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

// 发送消息
const sendMsg = () => {
  const id = getContentLength(activeMessageId.value) + 1 + ""
  updateContent(activeMessageId.value, {
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
      },
      onSuccess: (delta: string) => {
        response.value = delta;
      },
      onCreated: (data: CreateChatData) => {
        console.log(data)

        //这里的data是Coze的流式返回部分，该对象携带conversation_id
        /*setConversationsItems((prev: Content[]) => {
          const exist = prev.find(
            item => item.id === data.conversation_id || item.id === '0',
          );
          activeMessageId.value = data.conversation_id;

          if (!exist) {
            return [
              ...prev,
              {
                key: data.conversation_id,
                label: query ?? '',
              },
            ];
          } else {
            if (exist.id === '0') {
              const newConversationsItems = prev.map(item => {
                if (item.id === '0') {
                  return { id: data.conversation_id, value: query ?? '' };
                }
                return item;
              });

              return newConversationsItems;
            }
            return prev;
          }
        });*/
      },
    });

    if (response.value.trim() === "") return;

    const id = `${getContentLength(activeMessageId.value) + 1}`
    updateContent(activeMessageId.value, {
      id,
      role: ContentType.assistant,
      value: response.value
    })
  } catch (err) {
    console.error('API Error:', err);
  }
}

// enter键触发发送事件
const sendBtn = ref(null)

const handleKeydown = (e: any) => {
  if (e.key === 'Enter') {
    send()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="input-box">
    <TextArea v-model="value" placeholder="请输入内容..." width="100%"/>
    <Upload :size="28" style="margin-left: 20px"/>
    <Send @send="send" :state="state" :size="24" style="margin-left: 20px" ref="sendBtn"/>

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>