<script setup lang="ts">
import {useTemplateRef} from "vue";
import {type Message, ContentType} from "@/types";
import MessageItem from "@/components/MessageItem.vue";

defineProps<{ data: Message["content"] }>()

const messageList = useTemplateRef<HTMLDivElement>("messageList")

defineExpose({
  messageList
})
</script>

<template>
  <div ref="messageList" class="message-list">
    <ul>
      <li v-for="{id, role, value} in data" :class="{[ContentType[role]]: true}" :key="id">
        <MessageItem :value="value" :type="role"/>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageList.module";
</style>