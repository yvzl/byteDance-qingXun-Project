<script setup lang="ts">
import { ref } from "vue";
import { MenuFold } from "@icon-park/vue-next";
import { MenuUnfold } from "@icon-park/vue-next";
import HistoryMessage from "./HistoryMessage.vue";
import {  messageStore } from "@/stores";
import { coze } from "@/configs/coze";
import { storeToRefs } from "pinia";
interface Props {
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 32,
});
const store = messageStore()
const { mainState } = storeToRefs(store)
const isCollapsed = ref(false);

// 切换展开状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
const changeToInline = () => {
  mainState.value = 'inline'
}
const changeToChat = () => {
  mainState.value = 'chat'
}
</script>

<template>
  <div class="side-bar" :class="{ collapsed: isCollapsed }">
    <div class="menu">
      <div class="fold-btn" @click="toggleSidebar">
        <MenuFold v-if="!isCollapsed" theme="outline" :size="props.size" />
        <MenuUnfold v-else theme="outline" :size="props.size" />
      </div>
    </div>
    <div v-if="!isCollapsed" class="config-inputs">
      <input v-model="coze.url" placeholder="Base URL" />
      <input v-model="coze.botId" placeholder="Bot ID" />
      <input v-model="coze.pat" placeholder="PAT" />
    </div>
    <HistoryMessage />
    <div class="footer">
        <span>当前模式：{{ mainState }}</span>
        <button @click="changeToInline">内联</button>
        <button @click="changeToChat">独立</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/SideBar.module";
.config-inputs {
  margin-top: 20px;
  input {
    display: block;
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
</style>