<script setup lang="ts">
import Title from "@/components/Title.vue";
import Config from "@/components/Config.vue";
import MessageMode from "@/components/MessageMode.vue";
</script>

<template>
  <div class="tools">
    <Title name="MyChat"/>
    <MessageMode/>
    <Config/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Tools.module";
</style>