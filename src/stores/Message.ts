import {ref} from 'vue'
import {defineStore} from "pinia";
import  { type Message ,ContentType} from "@/types"

export const messageStore = defineStore("messageStore", () => {
    const data = ref<Message[]>([{
        id: "1",
        date: new Date("2025-1-25"),
        name: "新会话",
        content: [{
            id: "1",
            role: ContentType.user,
            value: "这里的 0 表示用户"
        }, {
            id: "2",
            role: ContentType.assistant,
            value: "以下是使用 Python, 实现的解码函数：\n\n```python\ndef decode_sequence(a, d0):\n    data = [d0]\n    for item in a:\n        data.append(data[-1] ^ item)\n    return data"
        }, {
            id: "3",
            role: ContentType.user,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "4",
            role: ContentType.assistant,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "5",
            role: ContentType.user,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "6",
            role: ContentType.assistant,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "7",
            role: ContentType.user,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "8",
            role: ContentType.assistant,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "9",
            role: ContentType.user,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "10",
            role: ContentType.assistant,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }]
    }])
    // 会话的 id
    const activeMessageId = ref<Message['id']>("1")

    // 切换对话 id
    const changeMessageId = (id: Message["id"]) => activeMessageId.value = id

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
        activeMessageId,
        findContent,
        changeMessageId,
        updateContent,
        getContentLength
    }
}, {
    persist: false,//持久化先关闭
})