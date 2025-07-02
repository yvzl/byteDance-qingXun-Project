import {baseUrl} from "@/configs";

interface ILLM {
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
    onStopError?: () => void
    onTimedOut?: (time: number) => void
    onError?: (err: string) => void
    onFinally?: () => void
}

const dataParse = (data: string) => JSON.parse(data.replace("data:", ""))

export const LLM = (data: ILLM) => {
    let chatId = ""
    const timeout = 10000
    const controller = new AbortController();
    const stopRequest = () => controller.abort()
    const {
        pat,
        content,
        conversationId,
        botId,
        userId,
        onCreated,
        onInProgress,
        onDelta,
        onMessageComplete,
        onChatComplete,
        onDone,
        onError,
        onFinally,
        onStop,
        onStopError,
        onTimedOut,
    } = data
    const init = {
        method: "POST",
        headers: {
            Authorization: pat,
            "Content-Type": "application/json"
        }
    }
    const map = {
        "event:conversation.chat.created": (data: string) => {
            const id = dataParse(data).id
            chatId = id
            onCreated?.(id)
        },
        "event:conversation.chat.in_progress": () => onInProgress?.(),
        "event:conversation.message.delta": (data: string) => onDelta?.(dataParse(data).content),
        "event:conversation.message.completed": (data: string) => onMessageComplete?.(dataParse(data).content),
        "event:conversation.chat.completed": () => onChatComplete?.(),
        "event:done": () => onDone?.(),
    }
    const timeoutId = setTimeout(() => {
        stopRequest()
        onTimedOut?.(timeout)
    }, timeout)
    fetch(`${baseUrl}/v3/chat?conversation_id=${conversationId}`, {
        ...init,
        body: JSON.stringify({
            bot_id: botId,
            stream: true,
            user_id: userId,
            auto_save_history: true,
            additional_messages: [{
                role: "user",
                content,
                content_type: "text"
            }]
        }),
        signal: controller.signal
    })
        .then(res => {
            const body = res.body
            if (!body) throw TypeError("body is not defined")
            const reader = body.getReader();
            const decoder = new TextDecoder("utf-8");
            const readStream = (): Promise<string> => reader.read().then((item: ReadableStreamReadResult<Uint8Array>) => {
                const {done, value} = item
                const s = decoder.decode(value, {stream: true})
                for (const item of s.split("\n\n")) {
                    if (item.trim() === "") continue
                    const [state, data] = item.split("\n")
                    if (state in map) map[state as keyof typeof map](data)
                }
                if (done) return s
                return readStream();
            });
            return readStream()
        })
        .then(() => clearTimeout(timeoutId))
        .catch(err => {
            clearTimeout(timeoutId)
            onError?.(err)
        }).finally(() => onFinally?.())
    return () => {
        clearTimeout(timeoutId)
        stopRequest()
        fetch(`${baseUrl}/v3/chat/cancel`, {
            ...init,
            body: JSON.stringify({
                chat_id: chatId,
                conversation_id: conversationId,
            })
        }).then(() => onStop?.()).catch(err => onStopError?.(err))
    }
}