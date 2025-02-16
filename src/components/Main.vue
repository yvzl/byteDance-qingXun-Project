<script setup lang="ts">
import {storeToRefs} from "pinia"
import {computed, ref} from "vue";
import {messageStore} from "@/stores"
import type {Message} from "@/types";
import MainBottom from "@/components/MainBottom.vue";
import MessageList from "@/components/MessageList.vue";

const store = messageStore()
const {findMessage} = store
const {activeMessageId} = storeToRefs(store)

const messageListRef = ref<InstanceType<typeof MessageList> | null>(null)
const messageData = computed<Message["content"]>(() => findMessage(activeMessageId.value)?.content || []) // 通过 id 查找当前会话
</script>

<template>
  <div class="main">
    <MessageList ref="messageListRef" :data="messageData"/>
    <MainBottom/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";
</style>