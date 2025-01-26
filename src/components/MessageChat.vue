<script setup lang="ts">
import MessageItem from '@/components/MessageItem.vue'
import chatHead from "@/assets/images/head.png"
import Head from "@/components/Head.vue";
import {ContentType} from "@/types";

defineProps<{ value: string, type: ContentType }>()
</script>

<template>
  <div class="message-chat">
    <Head :src="chatHead"/>
    <MessageItem :value="value" :type="type"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageChat.module";
</style>