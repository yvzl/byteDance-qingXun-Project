<script setup lang="ts">
import {Upload} from '@icon-park/vue-next'
import LLMInteraction from '@/utils/impl/LLMInteraction';
import { ref } from 'vue';


const File = ref<File|undefined>(undefined);
const {size = 24} = defineProps<{ size?: number }>()
const getCozeFileResponse = () => {//从Coze获取关于文件的对话
  return LLMInteraction.uploadFile()
}
const uploadFileByNative = async () => {
    if (File.value) {
        await LLMInteraction.uploadFile(File.value);
        emitFileInfoFunc(File.value);
    }
}
const emitFileInfo = defineEmits(['uploadFile'])
const emitFileInfoFunc = (file: File) => {//将文件信息和Coze的回复传递给父组件，由父组件的send方法传入仓库
  emitFileInfo('uploadFile', file);
}
</script>

<template>
  <div class="upload">
    <Upload theme="outline" :size="size"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Upload.module";
</style>