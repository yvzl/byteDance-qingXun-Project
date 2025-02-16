<script setup lang="ts">
import {messageStore} from "@/stores"
import {Message, MessageOne} from '@icon-park/vue-next'
import Tooltip from "@/components/Tooltip.vue";
import {storeToRefs} from "pinia";

const store = messageStore()
const {changeMainState} = store
const {mainState} = storeToRefs(store)
</script>

<template>
  <div class="message-mode">
    <Tooltip content="更改内联或独立对话状态">
      <div @click="changeMainState(false)" v-if="mainState" class="btn message-mode-1">
        <Message theme="outline" size="24"/>
      </div>
      <div @click="changeMainState(true)" v-else class="btn message-mode-2">
        <MessageOne theme="outline" size="24"/>
      </div>
    </Tooltip>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageMode.module";
</style>