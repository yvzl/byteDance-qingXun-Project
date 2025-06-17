interface ILLM {
    url: string
    query: RequestInit
    onCreated?: () => void
    onInProgress?: () => void
    onDelta?: (data: string) => void
    onMessageComplete?: (data: string) => void
    onChatComplete?: () => void
    onDone?: () => void
    onError?: (err: Error) => void
}

export const LLM = (data: ILLM) => {
    const {url, query, onCreated, onInProgress, onDelta, onMessageComplete, onChatComplete, onDone, onError} = data
    const map = {
        "event:conversation.chat.created": () => onCreated && onCreated(),
        "event:conversation.chat.in_progress":() => onInProgress && onInProgress(),
        "event:conversation.message.delta": (data: string) => onDelta && onDelta(JSON.parse(data.replace("data:", "")).content),
        "event:conversation.message.completed": (data: string) => onMessageComplete && onMessageComplete(JSON.parse(data.replace("data:", "")).content),
        "event:conversation.chat.completed": () => onChatComplete && onChatComplete(),
        "event:done": () => onDone && onDone(),
    }
    fetch(url, query).then(res => {
        const body = res.body
        if (!body) throw TypeError("body is not defined")
        const reader = body.getReader();
        const decoder = new TextDecoder("utf-8");
        const readStream = (): Promise<string> => reader.read().then((item: ReadableStreamReadResult<Uint8Array>) => {
            const {done, value} = item
            const s = decoder.decode(value, { stream: true })
            for(const item of s.split("\n\n")) {
                if(item.trim() === "") continue
                const [state, data] = item.split("\n")
                if(state in map) map[state as keyof typeof map](data)
            }
            if(done) return s
            return readStream();
        });
        return readStream()
    }).catch(err => {
        if(onError) onError(err)
    })
}