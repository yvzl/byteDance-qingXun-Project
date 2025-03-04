import {ref} from 'vue'
import {defineStore} from "pinia";
import {type Message} from "@/types"

export const messageStore = defineStore("messageStore", () => {
    const data = ref<Message[]>([{
        id: "1",
        date: new Date("2023-01-02"),
        name: "新会话1",
        content: []
    }, {
        id: "2",
        date: new Date("2024-01-10"),
        name: "新会话2",
        content: []
    }, {
        id: "3",
        date: new Date("2024-01-10"),
        name: "新会话3",
        content: []
    }, {
        id: "4",
        date: new Date("2025-01-25"),
        name: "新会话4",
        content: []
    }, {
        id: "5",
        date: new Date("2025-01-20"),
        name: "新会话5",
        content: []
    }, {
        id: "6",
        date: new Date("2025-02-11"),
        name: "新会话6",
        content: []
    }, {
        id: "7",
        date: new Date("2025-02-12"),
        name: "新会话7",
        content: []
    }])

    // 会话的 id
    const activeMessageId = ref<Message['id']>("1")
    const Response = ref<string>("")
    const mainState = ref<boolean>(false)

    // 切换对话 id
    const changeMessageId = (id: Message["id"]) => activeMessageId.value = id

    // 查找对应会话
    const findMessage = (id: Message["id"]): Message | undefined => data.value.find(item => item.id === id);

    // 查找对应会话 Content 的长度
    const getContentLength = (id: Message["id"]): number => findMessage(id)?.content?.length || 0

    // 新增对应会话的 Content
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
        // 如果当前会话为空，则不允许创建新会话
        const currentMessage = findMessage(activeMessageId.value);
        if (!currentMessage) return
        const currentContent = currentMessage.content
        if (currentContent?.length === 0) {
            alert("Don't create more than one empty conversation");
            return;
        }
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

    const changeMainState = (state: boolean) => mainState.value = state

    return {
        data,
        Response,
        mainState,
        activeMessageId,
        findMessage,
        addMessage,
        changeMessageId,
        addContent,
        getContentLength,
        updateContent,
        renameMessage,
        deleteMessage,
        changeMainState
    }
}, {
    persist: false,
})