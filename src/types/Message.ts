import { FileObject } from "@coze/api"

enum ContentType {
    user = "user", 
    assistant = "assistant",
}

interface Message {
    id: string
    date: Date
    name: string
    content: Content[]
}

interface Content {
    id: string
    role: ContentType
    value: string
    fileInfo?: FileObject
}

export {
    Message,
    ContentType,
    Content,
}