<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {messageStore} from "@/stores"
import {storeToRefs} from "pinia"
import MessageList from "@/components/MessageList.vue";
import InputBox from "@/components/InputBox.vue";
import type {Message} from "@/types";

const store = messageStore()
const {findContent} = store
const {activeMessageId} = storeToRefs(store)

const messageData = computed<Message["content"]>(() => findContent(activeMessageId.value) || []) // 通过 id 查找当前会话

const messageListRef = ref<InstanceType<typeof MessageList> | null>(null)

const list = ref<HTMLDivElement | null>(null)

onMounted(() => messageListRef.value && (list.value = messageListRef.value.messageList))
</script>

<template>

  <div class="main">
    
    <MessageList ref="messageListRef" :data="messageData"/>
    <InputBox :list="list"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";
</style>