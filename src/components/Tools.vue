<script setup lang="ts">
import {ref} from "vue";
import MessageMode from "@/components/MessageMode.vue";
import Title from "@/components/Title.vue";
import Config from "@/components/Config.vue";

const state = ref<boolean>(false)
</script>

<template>
  <div class="tools">
    <Title name="MyChat"/>
    <MessageMode v-model="state"/>
    <Config/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Tools.module";
</style>