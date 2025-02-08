<script setup lang="ts">
import {storeToRefs} from "pinia";
import {messageStore} from "@/stores";

const store = messageStore();
const {changeMessageId} = messageStore();
const {data, activeMessageId} = storeToRefs(store);
</script>

<template>
  <div class="history-message">
    <ul>
      <li :class="{active: id === activeMessageId}" v-for="{id, name} in data" :key="id"
          @click="changeMessageId(id)">
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
/* 添加一些样式以美化列表和按钮 */
@use "@/assets/styles/HistoryMessage.module";
</style>