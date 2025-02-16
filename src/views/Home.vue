<script setup lang="ts">
import {storeToRefs} from "pinia";
import {messageStore} from "@/stores";
import SideBar from '@/components/SideBar.vue'
import Main from '@/components/Main.vue';
import InlineMain from "@/components/InlineMain.vue";

const {mainState} = storeToRefs(messageStore())
</script>

<template>
  <div class="home">
    <SideBar/>
    <Main v-if="mainState"/>
    <InlineMain v-else/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Home.module";
</style>