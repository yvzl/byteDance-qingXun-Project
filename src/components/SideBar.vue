<script setup lang="ts">
import { ref } from "vue";
import HistoryMessage from "./HistoryMessage.vue";
import { MenuFold } from "@icon-park/vue-next";
import { MenuUnfold } from "@icon-park/vue-next";
import { coze } from "@/configs/coze";
import CreateMessage from "@/components/CreateMessage.vue";
import Title from "@/components/Title.vue";
import Tooltip from "@/components/Tooltip.vue";
import MessageMode from "@/components/MessageMode.vue";
const isCollapsed = ref<boolean>(false);

const state = ref<boolean>(true)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div class="side-bar" :class="{ collapsed: isCollapsed }">

    <div> </div>
    <div class="tools">
      <Title v-if="!isCollapsed" name="MyChat" />
      <Tooltip content="更改内联或独立对话状态">

        <MessageMode v-if="!isCollapsed" v-model="state" />
      </Tooltip>

      <div class="fold-btn" @click="toggleSidebar">
        <MenuFold v-if="!isCollapsed" theme="outline" :size="32" />
        <MenuUnfold v-else theme="outline" :size="32" />
      </div>
    </div>
    <CreateMessage v-if="!isCollapsed" />
    <HistoryMessage v-if="!isCollapsed" />
    <div v-if="!isCollapsed" class="config-inputs">
      <span>配置文件</span>
      <input v-model="coze.url" placeholder="Base URL" />
      <input v-model="coze.botId" placeholder="Bot ID" />
      <input v-model="coze.pat" placeholder="PAT" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/SideBar.module";

.config-inputs {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #AAB1BD;
  align-items: center;

  input {
    display: block;
    color: #AAB1BD;

    margin-bottom: 10px;
    padding: 8px;
    box-sizing: border-box;
    background-color: #303137;
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