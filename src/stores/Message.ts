import {ref} from 'vue'
import {defineStore} from "pinia";
import type {Message} from "@/types"

export const messageStore = defineStore("messageStore", () => {
    const data = ref<Message[]>([{
        id: "1",
        date: new Date("2025-1-25"),
        name: "新会话",
        content: [{
            id: "1",
            type: 0,
            value: "这里的 0 表示用户"
        }, {
            id: "2",
            type: 1,
            value: "以下是使用 Python, 实现的解码函数：\n\n```python\ndef decode_sequence(a, d0):\n    data = [d0]\n    for item in a:\n        data.append(data[-1] ^ item)\n    return data"
        }, {
            id: "3",
            type: 0,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "4",
            type: 1,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "5",
            type: 0,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "6",
            type: 1,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "7",
            type: 0,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "8",
            type: 1,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "9",
            type: 0,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "10",
            type: 1,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }]
    }])
    // 会话的 id
    const messageId = ref<Message['id']>("1")

    // 切换对话 id
    const changeMessageId = (id: Message["id"]) => messageId.value = id

    // 查找对应会话的 Content
    const findContent = (id: Message["id"]) => data.value.find(item => item.id === id)?.content;

    // 查找对应会话 Content 的长度
    const getContentLength = (id: Message["id"]) => findContent(id)?.length || 0

    // 更新对应会话的 Content
    const updateContent = (id: Message["id"], ...args: Message["content"]) => {
        const currentMessageList = findContent(id)
        if (!currentMessageList) return
        currentMessageList.push(...args);
    }
    return {
        data,
        messageId,
        findContent,
        changeMessageId,
        updateContent,
        getContentLength
    }
}, {
    persist: false,//持久化先关闭
})