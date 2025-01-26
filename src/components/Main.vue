<script setup lang="ts">
import {computed} from "vue";
import {messageStore} from "@/stores"
import {storeToRefs} from "pinia"
import MessageList from "@/components/MessageList.vue";
import InputBox from "@/components/InputBox.vue";
import type {Message} from "@/types";

const store = messageStore()
const {findContent} = store
const {messageId} = storeToRefs(store)

const messageData = computed<Message["content"]>(() => findContent(messageId.value) || []) // 通过 id 查找当前会话
</script>

<template>
  <div class="main">
    <MessageList :data="messageData"/>
    <InputBox style="margin-top: 20px"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";
</style>