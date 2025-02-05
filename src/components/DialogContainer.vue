<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Search,Close } from '@icon-park/vue-next'
import InputBox from '@/components/InputBox.vue';
import MessageList from '@/components/MessageList.vue';
import { messageStore } from '@/stores';
import { storeToRefs } from 'pinia';
/*这里的独立对话框需要单独显示AI对话内容这样一来需要使用Input中的逻辑，但是如果单纯添加input组件那么会导致Main中的消息也会更新
因此需要创建一个历史对话逻辑来进行会话分离
*/ 
const store = messageStore();
const { data, activeMessageId } = storeToRefs(store);
const list = ref<HTMLDivElement | null>(null)
const dialogState = ref<'collapsed' | 'expanded' | 'chat'>('collapsed');
const messageListRef = ref<InstanceType<typeof MessageList> | null>(null)
const toggleDialog = () => {
    if (dialogState.value === 'collapsed') {
        dialogState.value = 'expanded';
    } else if (dialogState.value === 'expanded') {
        dialogState.value = 'chat';
    }
};

const closeDialog = () => {
    dialogState.value = 'collapsed';
};
onMounted(() => messageListRef.value && (list.value = messageListRef.value.messageList))
</script>

<template>
    <div class="main">


        <div class="dialog-container">
            <div v-if="dialogState === 'collapsed'" @click="toggleDialog">
                <Search theme="outline" size=24 fill="#000" />
                
            </div>
            <div v-else-if="dialogState === 'expanded'">
                <div class="dialog-header">
                    <button @click="closeDialog">
                        <Close theme="outline" size=24 fill="#000" />
                    </button>
                </div>
                <InputBox :list="list" />

            </div>
            <div v-else-if="dialogState === 'chat'">
                <div class="dialog-header">
                    <button @click="closeDialog">关闭</button>
                </div>
                <MessageList :data="data.find(item => item.id === activeMessageId)?.content || []" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main{
    position: fixed;
    left: 30%;
    top: 0;
}
.dialog-container {
    position: relative;
    width: 300px;
    max-height: 500px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.dialog-header {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background: #f5f5f5;
    border-bottom: 1px solid #ccc;
}

.dialog-header button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
}
</style>
