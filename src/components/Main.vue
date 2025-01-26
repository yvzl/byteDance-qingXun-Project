<script setup lang="ts">
import {computed} from "vue";
import {messageStore} from "@/stores"
import {storeToRefs} from "pinia"
import MessageList from "@/components/MessageList.vue";
import InputBox from "@/components/InputBox.vue";
import type {Message} from "@/types"

const store = messageStore()
const {data, messageId} = storeToRefs(store)

const messageData = computed<Message["content"]>(() => {
  const result = data.value.find(({id}) => id === messageId.value)
  return result ? result.content : []
})
</script>

<template>
  <div class="main">
    <MessageList :data="messageData"/>
    <InputBox/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";
</style>