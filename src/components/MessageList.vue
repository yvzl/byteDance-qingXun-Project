<script setup lang="ts">
import {useTemplateRef} from "vue";
import {type IMessage, ContentType} from "@/types";
import MessageItem from "@/components/MessageItem.vue";

defineProps<{ data: IMessage["content"] }>()

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