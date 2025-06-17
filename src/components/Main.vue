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
const messageListRef = ref<InstanceType<typeof MessageList> | null>(null)
const messageData = computed<IMessage["content"]>(() => findMessage(activeMessageId.value)?.content || [])
</script>

<template>
  <div class="main">
    <MessageList ref="messageListRef" :data="messageData"/>
    <InputBox v-model="value"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";
</style>