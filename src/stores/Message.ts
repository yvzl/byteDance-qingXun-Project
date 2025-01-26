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
            value: "这里的0表示用户"
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
        },{
            id: "5",
            type: 0,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },{
            id: "6",
            type: 1,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },{
            id: "7",
            type: 0,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },{
            id: "8",
            type: 1,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },{
            id: "9",
            type: 0,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },{
            id: "10",
            type: 1,
            value: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }]
    }])

    const messageId = ref<Message['id']>("1")//我觉得这里可以通过设计历史对话box，点击切换 全局对话ID，来控制不同的会话窗口 
    return {
        data,
        messageId,
    }
}, {
    persist: false,//持久化先关闭
})