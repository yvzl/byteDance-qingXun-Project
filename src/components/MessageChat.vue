<script setup lang="ts">
import MessageItem from '@/components/MessageItem.vue'
import chatHead from "@/assets/images/head.png"
import Head from "@/components/Head.vue";

defineProps<{ value: string }>()
</script>

<template>
  <div class="message-chat">
    <Head style="margin-right: 12px" :src="chatHead"/>
    <MessageItem :value="value"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageChat.module";
</style>