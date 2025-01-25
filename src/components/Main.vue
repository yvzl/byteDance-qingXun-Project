<script setup lang="ts">
import {computed} from "vue";
import {messageStore} from "@/stores"
import {storeToRefs} from "pinia"
import MessageList from "@/components/MessageList.vue";
import InputBox from "@/components/InputBox.vue";

const store = messageStore()
const {data, messageId} = storeToRefs(store)

const messageData = computed(() => data.value.filter(({id}) => id === messageId.value)[0].content)
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