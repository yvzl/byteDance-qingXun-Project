import type {ToMap} from "@/types";

enum RoleType {
    user = "user",
    chat = "chat",
}

interface IMessage {
    id: string
    date: string | Date
    name: string
    content: ToMap<IContent>
}

interface IContent {
    id: string
    data: {
        [key in RoleType]: string;
    }
}

export {
    RoleType,
    IMessage,
    IContent,
}