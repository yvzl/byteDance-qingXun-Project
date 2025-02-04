  <script setup lang="ts">
  import { md } from "@/utils";
  import "github-markdown-css/github-markdown-dark.css";
  import { ContentType } from "@/types";
  import { ref, computed } from "vue";

  // 解构 props
  const props = defineProps<{
    value: string;
    type: ContentType;
  }>();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Markdown已复制到剪贴板");
    }).catch(err => {
      console.error("复制失败", err);
    });
  }

  // 提取代码块
  const codeBlocks = computed(() => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    let match;
    const blocks = [];
    while ((match = codeBlockRegex.exec(props.value)) !== null) {
      blocks.push(match[1].trim());
    }
    return blocks;
  });
</script>
  
  <template>
    <div :class="['message-item', 'markdown-body', ContentType[props.type]]">
      <div v-html="md.render(props.value)"></div>
      <button v-if="props.type === ContentType.assistant && codeBlocks.length > 0"
        @click="copyToClipboard(codeBlocks[0])">复制代码</button>
        <div></div>
      <button v-if="props.type === ContentType.assistant" @click="copyToClipboard(props.value)">复制Markdown</button>
    </div>
  </template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";
</style>