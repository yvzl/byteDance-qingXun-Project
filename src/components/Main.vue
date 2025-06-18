<script setup lang="ts">
import {storeToRefs} from "pinia"
import {computed, ref} from "vue";
import {messageStore} from "@/stores"
import MessageList from "@/components/MessageList.vue";
import InputBox from "@/components/InputBox.vue";
import type {IMessage} from "@/types";

const store = messageStore()
const {findMessage} = store
const {activeMessageId} = storeToRefs(store)

const value = ref<string>("")
const messageData = computed<IMessage["content"]>(() => findMessage(activeMessageId.value)?.content || {})
</script>

<template>
  <div class="main">
    <MessageList :list="messageData"/>
    <InputBox @beforeSend="(fn: () => Promise<void>) => fn()" v-model="value"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";
</style>