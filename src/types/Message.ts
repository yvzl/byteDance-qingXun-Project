enum ContentType {
    user,
    chat,
}

interface Message {
    id: string
    date: Date
    name: string
    content: Content[]
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