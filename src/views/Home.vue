<script setup lang="ts">
import {storeToRefs} from "pinia";
import {messageStore} from "@/stores"
import Main from '@/components/Main.vue';
import SideBar from '@/components/SideBar.vue'
import DefaultMain from "@/components/DefaultMain.vue";

const {activeMessageId} = storeToRefs(messageStore())
</script>

<template>
  <div class="home">
    <SideBar/>
    <div class="main">
      <Main v-if="activeMessageId"/>
      <DefaultMain v-else/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Home.module";
</style>