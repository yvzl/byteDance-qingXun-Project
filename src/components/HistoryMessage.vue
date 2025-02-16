<script setup lang="ts">
import {computed, reactive, toRefs} from "vue";
import {storeToRefs} from "pinia";
import {messageStore} from "@/stores";
import More from "@/components/More.vue";
import MoreDialog from "@/components/MoreDialog.vue";
import {Message} from "@/types";

const store = messageStore();
const {changeMessageId} = store;
const {data, activeMessageId} = storeToRefs(store);

const dialog = reactive<{
  dialogId: Message["id"]
  posX: number
  posY: number
  state: boolean
}>({
  dialogId: "1",
  posX: 0,
  posY: 0,
  state: false
})

const {dialogId, posX, posY, state} = toRefs(dialog)

const resetDate = (date: Date): Date => {
  date.setHours(0, 0, 0, 0)
  return date
}

const getDayTime = (day: number): number => day * 86400000

const groupMap = new Map([
  [(num: number) => num === getDayTime(0), "今天"],
  [(num: number) => num <= getDayTime(1), "昨天"],
  [(num: number) => num <= getDayTime(7), "7日内"],
  [(num: number) => num <= getDayTime(30), "30日内"],
])

const dataGroups = computed(() => Object.entries(Object.groupBy(data.value, ({date}) => {
  const toDate = new Date(date);
  for (const [key, value] of groupMap) {
    if (key(resetDate(new Date()).getTime() - resetDate(toDate).getTime())) return value
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(toDate)
})).reverse())

const moreClick = (_id: Message["id"], x: number, y: number) => {
  dialogId.value = _id
  posX.value = x
  posY.value = y
  state.value = true
}

document.body.addEventListener("click", () => state.value = false)
</script>

<template>
  <div class="history-message">
    <div class="history-message-item" v-for="[key, value] of dataGroups" :key="key">
      <span>{{ key }}</span>
      <ul>
        <li :class="{active: id === activeMessageId}" v-for="{id, name} in value" :key="id"
            @click="changeMessageId(id)">
          <p>{{ name }}</p>
          <More @more-click="moreClick" :id="id"/>
        </li>
      </ul>
    </div>
    <MoreDialog :id="dialogId" :posX="posX" :posY="posY" :state="state"/>
  </div>
</template>

<style scoped lang="scss">
/* 添加一些样式以美化列表和按钮 */
@use "@/assets/styles/HistoryMessage.module";
</style>