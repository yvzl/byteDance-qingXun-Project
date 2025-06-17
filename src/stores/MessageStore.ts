import {ref} from 'vue'
import {defineStore} from "pinia";
import {type IMessage, MessageMap} from "@/types"

export const messageStore = defineStore("messageStore", () => {
    const data = ref<MessageMap>({
        "1": {
            id: "1",
            date: new Date("2023-01-02"),
            name: "新会话1",
            content: []
        }
    })
    const max_id = ref<number>(2)
    const activeMessageId = ref<IMessage['id']>("1")
    const Response = ref<string>("")

    const changeMessageId = (id: IMessage["id"]) => activeMessageId.value = id

    const findMessage = (id: IMessage["id"]): IMessage | undefined => data.value[id]

    const getContentLength = (id: IMessage["id"]): number => findMessage(id)?.content?.length || 0

    const addContent = (id: IMessage["id"], ...args: IMessage["content"]) => {
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
        const id = `${max_id.value}`
        data.value[id] = {
            id,
            date: new Date(),
            name: `新会话${id}`,
            content: [],
        }
        changeMessageId(id);
        ++max_id.value
    }

    const deleteMessage = (id: IMessage["id"]) => {
        const currentMessage = findMessage(id);
        if (!currentMessage) return
        delete data.value[id];
    }

    const renameMessage = (id: IMessage["id"], name: string) => {
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