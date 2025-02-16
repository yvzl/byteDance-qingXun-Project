<script setup lang="ts">
import {ref} from "vue";
import type {FileObject} from "@coze/api";
import InputBox from "@/components/InputBox.vue";
import FileList from "@/components/FileList.vue";

const fileInfo = ref<FileObject | undefined>(undefined)
const value = ref<string>("")
</script>

<template>
  <div class="main-bottom">
    <FileList v-if="fileInfo" :file="fileInfo"/>
    <InputBox v-model:value="value" v-model:file="fileInfo"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MainBottom.module";
</style>