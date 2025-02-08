<script setup lang="ts">
import {ref} from "vue";
import HistoryMessage from "./HistoryMessage.vue";
import {coze} from "@/configs/coze";
import CreateMessage from "@/components/CreateMessage.vue";
import Title from "@/components/Title.vue";
import MessageMode from "@/components/MessageMode.vue";
const isCollapsed = ref<boolean>(false);

const state = ref<boolean>(true)
</script>

<template>
  <div class="side-bar" :class="{ collapsed: isCollapsed }">
    <div v-if="isCollapsed" class="config-inputs">
      <input v-model="coze.url" placeholder="Base URL"/>
      <input v-model="coze.botId" placeholder="Bot ID"/>
      <input v-model="coze.pat" placeholder="PAT"/>
    </div>
    <div class="tools">
      <Title name="MyChat"/>
      <MessageMode v-model="state" />
    </div>
    <CreateMessage/>
    <HistoryMessage/>
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

.tools {
  display: flex;
  justify-content: space-between;
  padding: 25px 10px 34px 3px;
}
</style>