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
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }, {
            id: "1",
            type: 1,
            value: "以下是使用 Python, 实现的解码函数：\n\n```python\ndef decode_sequence(a, d0):\n    data = [d0]\n    for item in a:\n        data.append(data[-1] ^ item)\n    return data"
        }]
    }])

    const messageId = ref<Message['id']>("1")
    return {
        data,
        messageId,
    }
}, {
    persist: true,
})