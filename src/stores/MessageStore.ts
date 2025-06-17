import {ref} from 'vue'
import {defineStore} from "pinia";
import {type Message} from "@/types"

export const messageStore = defineStore("messageStore", () => {
    const data = ref<Message[]>([{
        id: "1",
        date: new Date("2023-01-02"),
        name: "新会话1",
        content: []
    }])

    const activeMessageId = ref<Message['id']>("1")
    const Response = ref<string>("")

    const changeMessageId = (id: Message["id"]) => activeMessageId.value = id

    const findMessage = (id: Message["id"]): Message | undefined => data.value.find(item => item.id === id);

    const getContentLength = (id: Message["id"]): number => findMessage(id)?.content?.length || 0

    const addContent = (id: Message["id"], ...args: Message["content"]) => {
        const currentMessageList = findMessage(id)
        if (!currentMessageList) return
        currentMessageList.content.push(...args);
    }

    const updateContent = (response: string) => {
        Response.value = response;
        const currentMessage = findMessage(activeMessageId.value);
        if (!currentMessage) return
        const currentContent = currentMessage.content
        const lastItem = currentContent[currentContent.length - 1];
        if (lastItem && 'value' in lastItem) lastItem.value = Response.value;
    }

    const addMessage = () => {
        const id = `${Math.max(...data.value.map(({id}) => +id)) + 1}`
        data.value.push({
            id: id,
            date: new Date(),
            name: `新会话${id}`,
            content: [],
        });
        changeMessageId(id);
    }

    const deleteMessage = (id: Message["id"]) => {
        const currentMessage = findMessage(id);
        if (!currentMessage) return
        data.value.splice(data.value.findIndex(item => item.id === id), 1);
    }

    const renameMessage = (id: Message["id"], name: string) => {
        const currentMessage = findMessage(id);
        if (!currentMessage) return
        currentMessage.name = name;
    }

    return {
        data,
        Response,
        activeMessageId,
        findMessage,
        addMessage,
        changeMessageId,
        addContent,
        getContentLength,
        updateContent,
        renameMessage,
        deleteMessage,
    }
}, {
    persist: true,
})