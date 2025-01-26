<!--InputBox.vue-->
<script setup lang="ts">
import { watch } from "fs";
import {ref} from "vue";
import { messageStore } from "@/stores/Message";
import { storeToRefs } from "pinia";
import { defineEmits } from 'vue';


//inpuBox直接与store通信，表示新增消息
const store = messageStore();
const { data, messageId } = storeToRefs(store);
const emit = defineEmits(['chatWithCoze'])
const mes = ref("");
const fileInfo = ref<File|undefined>(undefined);

const submit = () => {
  if (mes.value.trim() === "") return;

  // 通过messageId 获取当前消息列表
  const currentMessageList = data.value.find(item => item.id === messageId.value)?.content || [];

  // 添加新消息
  const newMessage = {
    id: String(currentMessageList.length + 1),
    type: 0, // 0 表示用户消息
    value: mes.value
  };

  currentMessageList.push(newMessage);

  // 更新 store 中的消息列表
  data.value = data.value.map(item => 
    item.id === messageId.value ? { ...item, content: currentMessageList } : item
  );
  emit('chatWithCoze', mes,fileInfo);

  mes.value = ""; // 清空输入框
};

const file = () => {
  console.log("file");
};
const clear = () => {
  mes.value = "";
};
</script>

<template>
  <div class="input-box">
    <svg @click="file"
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
    <textarea v-model="mes" type="text" class="input" placeholder="请输入内容..."></textarea>
    <button @click="submit">提交</button>
    <button @click="clear">清空</button>

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>