<script setup lang="ts">
import {Upload} from '@icon-park/vue-next'
import LLMInteraction from '@/utils/LLMInteraction';
import {ref} from 'vue';
import {FileObject} from '@coze/api';
import Tooltip from '@/components/Tooltip.vue';

const File = ref<File | undefined>(undefined);
const {size = 24} = defineProps<{ size?: number }>();

// 我确信这里的上传文件无误，包括 React 开源项目获取的 File 、fileInfo 对象是一样的，并且官方的 React 项目的 Coze 也无法读取文件信息
const uploadFileByNative = async () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = async (event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      File.value = target.files[0];
      if (File.value) {
        console.log(File.value);
        const fileInfo = await LLMInteraction.uploadFile(File.value); //从Coze获取关于文件的对话
        emitFileInfoFunc(fileInfo);
      }
    }
  };
  fileInput.click();
}

const emitFileInfo = defineEmits(['uploadFile'])

// 将文件信息和 Coze 的回复传递给父组件，由父组件的 send 方法传入仓库
const emitFileInfoFunc = (fileInfo?: FileObject) => emitFileInfo('uploadFile', fileInfo);
</script>

<template>
  <div class="upload">
    <Tooltip content="上传文件(接受图片、PDF 等文件)">
      <Upload theme="outline" :size="size" @click="uploadFileByNative"/>
    </Tooltip>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Upload.module";
</style>