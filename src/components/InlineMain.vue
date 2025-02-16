<script setup lang="ts">
import {ref} from "vue";
import InlineInput from "@/components/InlineInput.vue";
import InlineDialog from "@/components/InlineDialog.vue";

const isExpanded = ref<boolean>(false);
</script>

<template>
  <div class="main">
    <InlineInput v-if="!isExpanded" v-model="isExpanded"/>
    <InlineDialog v-else v-model="isExpanded"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Main.module";
</style>