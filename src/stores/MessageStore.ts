import {ref} from 'vue'
import {defineStore} from "pinia";
import {botId, baseUrl, pat} from "@/configs"
import type {IContent, IMessage, ToMap} from "@/types"

export const messageStore = defineStore("messageStore", () => {
    type MessageMap = ToMap<IMessage>
    type messageId = IMessage['id'] | null
    type contentId = IContent['id'] | null

    const data = ref<MessageMap>({})

    const runningState = ref<boolean>(false)
    const maxId = ref<number>(1)
    const activeMessageId = ref<messageId>(null)
    const Response = ref<string>("")
    const stopRequest = ref<() => void>(() => {})

    const addMaxId = () => ++maxId.value

    const changeMessageId = (id: messageId) => activeMessageId.value = id

    const findMessage = (id: messageId): IMessage | undefined => {
        if (!id) return
        return data.value[id]
    }

    const findContent = (data: IMessage["content"], id: contentId) => {
        if (!id) return
        return data[id]
    }

    const changeStopRequest = (Fn: () => void) => stopRequest.value = Fn

    const changeRunning = (state: boolean) => runningState.value = state

    const addContent = (id: messageId, data: IContent) => {
        const currentMessageList = findMessage(id)
        if (!currentMessageList) return
        currentMessageList.content[data.id] = data
    }

    const updateContent = (id: messageId, contentId: IContent["id"], response: string) => {
        Response.value = response;
        if (!id) return;
        const currentMessage = findMessage(id);
        if (!currentMessage) return
        const lastItem = findContent(currentMessage.content, contentId)
        if(!lastItem) return;
        lastItem.data.chat = Response.value
    }

    const addMessage = () => fetch(`${baseUrl}/v1/conversation/create`, {
        method: "POST",
        headers: {
            Authorization: pat,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bot_id: botId,
        })
    }).then(res => res.json()).then(res => {
        const id = res.data.id
        data.value[id] = {
            id,
            date: new Date(),
            name: `新会话${maxId.value}`,
            content: {}
        }
        changeMessageId(id)
    }).catch(() => {
        runningState.value = false
    })

    const deleteMessage = (id: messageId) => {
        const currentMessage = findMessage(id);
        if (!currentMessage) return
        if (id === activeMessageId.value) changeMessageId(null)
        delete data.value[id as string];
    }

    const renameMessage = (id: messageId, name: string) => {
        const currentMessage = findMessage(id);
        if (!currentMessage) return
        currentMessage.name = name;
    }

    return {
        data,
        Response,
        activeMessageId,
        maxId,
        runningState,
        stopRequest,
        findMessage,
        addMessage,
        changeMessageId,
        addContent,
        updateContent,
        renameMessage,
        deleteMessage,
        addMaxId,
        changeRunning,
        changeStopRequest,
    }
}, {
    persist: true,
})