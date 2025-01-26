enum ContentType {
    user,
    chat,
}

interface Message {
    id: string
    date: Date
    name: string
    content: Content[]//对于每一个会话都携带本会话的所有对话内容
}

interface Content {
    id: string
    type: ContentType
    value: string
}

export {
    Message,
    Content,
    ContentType
}