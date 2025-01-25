<!--MessageList.vue-->
<script setup lang="ts">
import { type Content, ContentType} from "@/types"
import MessageChat from "@/components/MessageChat.vue";
import MessageUser from "@/components/MessageUser.vue";

defineProps<{ data: Content[] }>()

</script>

<template>
  <div class="message-list">
    <ul>
      <li v-for="{id, type, value} in data" :class="{[ContentType[type]]: true}" :key="id">
        <MessageUser :value="value" v-if="type === ContentType['user']" />
        <MessageChat :value="value" v-else-if="type === ContentType['chat']" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageList.module";
</style>