<script setup lang="ts">
import {configStore} from "@/stores";
import {storeToRefs} from "pinia";
import {toRefs} from "vue";


const config = configStore();

const {changeUrl, changePat, changeBotId} = config
const {coze} = storeToRefs(config)
const {url, pat, botId} = toRefs(coze.value)


</script>

<template>
  <div class="chat-config">
    <span>自定义配置</span>
    <!--    <input :value="url" placeholder="Base URL"/>-->
    <!--    <input :value="botId" placeholder="Bot ID"/>-->
    <!--    <input :value="pat" placeholder="PAT"/>-->
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/ChatConfig.module";
</style>