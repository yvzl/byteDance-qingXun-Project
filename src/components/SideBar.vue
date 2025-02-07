<script setup lang="ts">
import { ref } from "vue";
import { MenuFold } from "@icon-park/vue-next";
import { MenuUnfold } from "@icon-park/vue-next";
import HistoryMessage from "./HistoryMessage.vue";
import { coze } from "@/configs/coze";
interface Props {
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 32,
});

const isCollapsed = ref(false);

// 切换展开状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
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
</style>