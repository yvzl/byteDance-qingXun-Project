<script setup lang="ts">
import MessageItem from '@/components/MessageItem.vue'

defineProps<{value: string}>()
</script>

<template>
  <div class="message-user">
    <MessageItem :value="value" />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageUser.module";
</style>