<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import MessageList from "@/components/MessageList.vue";
import InputBox from "@/components/InputBox.vue";
import type { Message } from "@/types";
import { messageStore } from "@/stores";

const store = messageStore();
const { addMessage, changeMessageId } = messageStore();
const { data, activeMessageId } = storeToRefs(store);

// 计算属性，获取所有对话
const conversations = computed(() => data.value);

// 切换会话的方法
const handleConversationClick = (id: Message['id']) => {
  changeMessageId(id);
};

// 新增对话的方法
const handleAddConversation = () => {
  addMessage();
};
</script>

<template>
  <div class="history-message">
    <span>历史对话列表</span>
    <button @click="handleAddConversation">新增对话</button>

    <ul>
      <li v-for="conversation in conversations" :key="conversation.id" @click="handleConversationClick(conversation.id)">
        {{ conversation.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
/* 添加一些样式以美化列表和按钮 */
.history-message {
    padding-top: 5%;
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 60%;
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
}

button {
  margin-top: 16px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>