<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {messageStore} from "@/stores"
import {Search, Close} from '@icon-park/vue-next'
import {storeToRefs} from "pinia"
import MessageList from "@/components/MessageList.vue";
import InputBox from "@/components/InputBox.vue";
import type {Message} from "@/types";

const store = messageStore()
const {findContent} = store
const {activeMessageId, mainState} = storeToRefs(store)
const isExpanded = ref(false);
const messageData = computed<Message["content"]>(() => findContent(activeMessageId.value) || []) // 通过 id 查找当前会话

const messageListRef = ref<InstanceType<typeof MessageList> | null>(null)

const list = ref<HTMLDivElement | null>(null)

onMounted(() => messageListRef.value && (list.value = messageListRef.value.messageList))
const closeDialog = () => {
  isExpanded.value = false
}
</script>

<template>

  <!-- 内联对话框模式 -->
  <div class="main" v-if="mainState == 'inline'">
    <div v-if="!isExpanded" class="inline-input-box" @click="isExpanded = true">
      <span>Search from this. . .</span>
      <Search :size="28" :fill="'#000'"/>
    </div>
    <div v-else class="inline-dialog">
      <div class="head">
        <Close @click="closeDialog" theme="outline" size=24 fill="white"/>
      </div>
      <MessageList v-if="messageData" ref="messageListRef" :data="messageData"/>
      <InputBox :list="list"/>
    </div>
  </div>
  <div v-else class="main">
    <!-- 独立对话框模式 -->
    <MessageList ref="messageListRef" :data="messageData"/>
    <InputBox :list="list"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";

.inline-input-box {
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 20px;
  width: 60%;
  border-radius: 10px;
  color: black;
  font-family: 'Courier New', Courier, monospace;
}

.head {
  display: flex;
  justify-content: flex-end;
  width: 90%;

}

.inline-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
}
</style>