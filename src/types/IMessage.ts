import { FileObject } from "@coze/api"

enum ContentType {
    user = "user", 
    assistant = "assistant",
}

interface IMessage {
    id: string
    date: string | Date
    name: string
    content: IContent[]
}

interface IContent {
    id: string
    role: ContentType
    value: string
    fileInfo?: FileObject
}

type MessageMap = Record<IMessage["id"], IMessage>

export {
    IMessage,
    ContentType,
    IContent,
    MessageMap
}