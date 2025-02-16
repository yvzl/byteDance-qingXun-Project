<script setup lang="ts">
import {ContentType} from "@/types";
import MessageItem from '@/components/MessageItem.vue';

defineProps<{ value: string, type: ContentType }>()
</script>

<template>
  <div class="message-user">
    <MessageItem :value="value" :type="type"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageUser.module";
</style>