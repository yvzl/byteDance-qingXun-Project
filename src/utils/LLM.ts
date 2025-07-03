import {baseUrl} from "@/configs";

interface IEventMap {
    "event:conversation.chat.created": (data: string) => void
    "event:conversation.chat.in_progress": () => void
    "event:conversation.message.delta": (data: string) => void
    "event:conversation.message.completed": (data: string) => void
    "event:conversation.chat.completed": () => void
    "event:done": () => void
}

interface ILLMConfigs {
    pat: string
    botId: string
    userId: string
    conversationId: string
    content: string
    onCreated?: (id: string) => void
    onInProgress?: () => void
    onDelta?: (data: string) => void
    onMessageComplete?: (data: string) => void
    onChatComplete?: () => void
    onDone?: () => void
    onStop?: () => void
    onStopError?: (err: string) => void
    onTimedOut?: (time: number) => void
    onError?: (err: string) => void
    onFinally?: () => void
}

export class LLM {
    private readonly pat!: string
    private readonly botId!: string
    private readonly userId!: string
    private readonly conversationId!: string
    private readonly content!: string
    private readonly onCreated?: (id: string) => void
    private readonly onInProgress?: () => void
    private readonly onDelta?: (data: string) => void
    private readonly onMessageComplete?: (data: string) => void
    private readonly onChatComplete?: () => void
    private readonly onDone?: () => void
    private readonly onStop?: () => void
    private readonly onStopError?: (err: string) => void
    private readonly onTimedOut?: (time: number) => void
    private readonly onError?: (err: string) => void
    private readonly onFinally?: () => void
    private chatId = ""
    private readonly timeout = 100000
    private readonly controller = new AbortController()
    private readonly timer = setTimeout(() => {
        this.controller.abort()
        this.onTimedOut?.(this.timeout)
    }, this.timeout)
    private readonly eventMap: IEventMap = {
        "event:conversation.chat.created": (data: string) => {
            const id = this.dataParse(data).id
            this.chatId = id
            this.onCreated?.(id)
        },
        "event:conversation.chat.in_progress": () => {
            this.onInProgress?.()
        },
        "event:conversation.message.delta": (data: string) => {
            this.onDelta?.(this.dataParse(data).content)
        },
        "event:conversation.message.completed": (data: string) => {
            this.onMessageComplete?.(this.dataParse(data).content)
        },
        "event:conversation.chat.completed": () => {
            this.onChatComplete?.()
        },
        "event:done": () => {
            this.onDone?.()
        },
    }

    constructor(configs: ILLMConfigs) {
        Object.assign(this, configs)
        this.send()
    }

    private readonly dataParse = (data: string) => JSON.parse(data.replace("data:", ""))

    private readonly requestStop = () => {
        fetch(`${baseUrl}/v3/chat/cancel`, {
            method: "POST",
            headers: {
                Authorization: this.pat,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                conversation_id: this.conversationId,
            })
        }).then(() => this.onStop?.()).catch(err => this.onStopError?.(err))
    }

    public readonly readStream = (reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder): Promise<string> => reader.read().then((item: ReadableStreamReadResult<Uint8Array>) => {
        const {done, value} = item
        const s = decoder.decode(value, {stream: true})
        for (const item of s.split("\n\n")) {
            if (item.trim() === "") continue
            const [state, data] = item.split("\n")
            if (state in this.eventMap) this.eventMap[state as keyof typeof this.eventMap](data)
        }
        if (done) return s
        return this.readStream(reader, decoder);
    });

    private readonly send = () => {
        fetch(`${baseUrl}/v3/chat?conversation_id=${this.conversationId}`, {
            method: "POST",
            headers: {
                Authorization: this.pat,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                bot_id: this.botId,
                stream: true,
                user_id: this.userId,
                auto_save_history: true,
                additional_messages: [{
                    role: "user",
                    content: this.content,
                    content_type: "text"
                }]
            }),
            signal: this.controller.signal
        }).then(res => {
            const body = res.body
            if (!body) throw TypeError("body is not defined")
            return this.readStream(body.getReader(), new TextDecoder("utf-8"))
        }).then(() => clearTimeout(this.timer)).catch(err => {
            clearTimeout(this.timer)
            this.onError?.(err)
        }).finally(() => this.onFinally?.())
    }

    public readonly stopRequest = async () => {
        clearTimeout(this.timer)
        this.controller.abort()
        this.requestStop()
    }
}