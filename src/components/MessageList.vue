<script setup lang="ts">
import {useTemplateRef} from "vue";
import {type Message, ContentType} from "@/types";
import MessageChat from "@/components/MessageChat.vue";
import MessageUser from "@/components/MessageUser.vue";

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
        <MessageUser :value="value" :type="role" v-if="role === ContentType['user']"/>
        <MessageChat :value="value" :type="role" v-else-if="role === ContentType['assistant']"/>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageList.module";
</style>