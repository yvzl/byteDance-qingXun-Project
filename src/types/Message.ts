
enum ContentType {
    user = "user", 
    assistant = "assistant",
}

interface Message {
    id: string
    date: Date
    name: string
    content: Content[] // 对于每一个会话都携带本会话的所有对话内容
}

interface Content {
    id: string
    role: ContentType
    value: string
}

export {
    Message,
    ContentType,
    Content,
}