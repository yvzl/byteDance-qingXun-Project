<script setup lang="ts">
import { computed, ref } from "vue";
import { messageStore } from "@/stores"
import { storeToRefs } from "pinia"
import MessageList from "@/components/MessageList.vue";
import InputBox from "@/components/InputBox.vue";
import LLMInteraction from "@/utils/impl/LLMInteraction";
import { CreateChatData } from "@coze/api";

const store = messageStore() // defineStore 返回的是一个 store 构造函数，所以引用函数
const { data, messageId } = storeToRefs(store)
const response = ref<any>(null)
const query = ref("你好");
const messageData = computed(() => data.value.filter(({ id }) => id === messageId.value)[0].content)//因为所有会话数据存入在data中，所以需要根据当前会话id进行过滤
const chatWithCoze = async (mes: any, file?: File) => {
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

    // 通过messageId 获取当前消息列表
    const currentMessageList = data.value.find(item => item.id === messageId.value)?.content || [];

    // 添加新消息
    const newMessage = {
      id: String(currentMessageList.length + 1),
      type: 1, // 1 表示AI消息
      value: response.value
    };

    currentMessageList.push(newMessage);

    // 更新 store 中的消息列表
    data.value = data.value.map(item =>
      item.id === messageId.value ? { ...item, content: currentMessageList } : item
    );
  } catch (err) {

    console.error('API Error:', err);
  }/*
  
  好像不能直接通过一个方法实现与Coze对话，只能在组件中调用streamingChat 并按 onUpdate, onSuccess, onCreated 三个方法进行处理
  但是如果不通过一个方法调用 Coze ，可能会在实现其他功能的时候出现麻烦
  
  LLMInteraction.chat(mes).then((res: string) => {
        console.log(res);
        response.value = res;
        if (res.trim() === "") return;

        // 通过messageId 获取当前消息列表
        const currentMessageList = data.value.find(item => item.id === messageId.value)?.content || [];

        // 添加新消息
        const newMessage = {
            id: String(currentMessageList.length + 1),
            type: 1, // 1 表示AI消息
            value: res
        };

        currentMessageList.push(newMessage);

        // 更新 store 中的消息列表
        data.value = data.value.map(item =>
            item.id === messageId.value ? { ...item, content: currentMessageList } : item
        );
    }).catch((err: any) => {
        console.error('Chat error:', err);
    });*/
}
</script>

<template>
  <div class="main">
    <MessageList :data="messageData" />
    <InputBox @chatWithCoze="chatWithCoze" />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";
</style>