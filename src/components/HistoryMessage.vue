<script setup lang="ts">
import {computed} from "vue";
import {storeToRefs} from "pinia";
import {messageStore} from "@/stores";

const store = messageStore();
const {changeMessageId} = messageStore();
const {data, activeMessageId} = storeToRefs(store);

const resetDate = (date: Date): Date => {
  date.setHours(0, 0, 0, 0)
  return date
}

const dateDiff = (date: Date, fn: (num: number) => boolean): boolean => {
  const before = resetDate(date)
  const now = resetDate(new Date());
  return fn(now.getTime() - before.getTime());
}

const getDayTime = (day: number): number => day * 86400000

const groupMap = new Map([
  [(num: number) => num === getDayTime(0), "今天"],
  [(num: number) => num <= getDayTime(1), "昨天"],
  [(num: number) => num <= getDayTime(7), "7日内"],
  [(num: number) => num <= getDayTime(30), "30日内"],
])

const dataGroups = computed(() => Object.groupBy(data.value, ({date}) => {
  for (const [key, value] of groupMap) {
    if (key(resetDate(new Date()).getTime() - resetDate(date).getTime())) return value
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}))
</script>

<template>
  <div class="history-message">
    <ul v-for="[key, value] of Object.entries(dataGroups).reverse()">
      {{ key }}
      <li :class="{active: id === activeMessageId}" v-for="{id, name} in value" :key="id"
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