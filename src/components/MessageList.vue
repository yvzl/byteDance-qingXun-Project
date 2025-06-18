<script setup lang="ts">
import {type IMessage, RoleType} from "@/types";
import MessageItem from "@/components/MessageItem.vue";

defineProps<{ list: IMessage["content"] }>()
</script>

<template>
  <div class="message-list">
    <ul>
      <template v-for="{id, data} in list" :key="id">
        <li v-for="(value, type) of data" :class="{[RoleType[type]]: true}" :key="type">
          <MessageItem :value="value" :type="type"/>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageList.module";
</style>