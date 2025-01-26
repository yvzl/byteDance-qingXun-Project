<script setup lang="ts">
import {type Message, ContentType} from "@/types"
import MessageChat from "@/components/MessageChat.vue";
import MessageUser from "@/components/MessageUser.vue";

defineProps<{ data: Message["content"] }>()

</script>

<template>
  <div class="message-list">
    <ul>
      <li v-for="{id, type, value} in data" :class="{[ContentType[type]]: true}" :key="id">
        <MessageUser :value="value" :type="type" v-if="type === ContentType['user']"/>
        <MessageChat :value="value" :type="type" v-else-if="type === ContentType['chat']"/>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageList.module";
</style>