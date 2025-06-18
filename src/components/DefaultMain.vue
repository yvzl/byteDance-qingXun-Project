<script setup lang="ts">
import {ref} from "vue";
import InputBox from "@/components/InputBox.vue";
import {messageStore} from "@/stores";

const {addMessage, addMaxId} = messageStore()

const value = ref<string>("")

const handleBeforeSend = async (fn: () => Promise<void>) => {
  await addMessage()
  addMaxId()
  await fn()
}
</script>

<template>
  <div class="default-main">
    <div class="box">
      <h1>您好，有什么我能帮您的吗</h1>
      <InputBox @beforeSend="handleBeforeSend" @afterSend="value = ''" v-model="value"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/DefaultMain.module";
</style>