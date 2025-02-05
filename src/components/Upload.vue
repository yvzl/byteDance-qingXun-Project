<script setup lang="ts">
import {Upload} from '@icon-park/vue-next'
import LLMInteraction from '@/utils/impl/LLMInteraction';
import {ref} from 'vue';
import {FileObject} from '@coze/api';

const File = ref<File | undefined>(undefined);
const {size = 24} = defineProps<{ size?: number }>()
//我确信这里的上传文件无误，包括React开源项目获取的Flie、fileinfo对象是一样的，并且官方的React项目的Coze也无法读取文件信息
const uploadFileByNative = async () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = async (event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      File.value = target.files[0];
      if (File.value) {
        const fileInfo = await LLMInteraction.uploadFile(File.value); //从Coze获取关于文件的对话
        emitFileInfoFunc(fileInfo);
      }
    }
  };
  fileInput.click();
}

const emitFileInfo = defineEmits(['uploadFile'])
const emitFileInfoFunc = (fileInfo?: FileObject) => { //将文件信息和Coze的回复传递给父组件，由父组件的send方法传入仓库
  emitFileInfo('uploadFile', fileInfo);
}
</script>

<template>
  <div class="upload">
    <Upload theme="outline" :size="size" @click="uploadFileByNative"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Upload.module";
</style>