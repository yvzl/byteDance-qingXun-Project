<script setup lang="ts">
import MessageItem from '@/components/MessageItem.vue'
import chatHead from "@/assets/images/head.png"
import Avatar from "@/components/Avatar.vue"
import {ContentType} from "@/types";

defineProps<{ value: string, type: ContentType }>()
</script>

<template>
  <div class="message-chat">
    <Avatar :src="chatHead"/>
    <MessageItem :value="value" :type="type"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageChat.module";
</style>