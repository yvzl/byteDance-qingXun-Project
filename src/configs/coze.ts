// 环境变量
const coze = {
    url: "https://api.coze.cn",
    pat: "pat_iKmuFMcHK1R0L7YyDNrrsZ71RsbdsK2NfTeKa3QVXwKR5q2nPN3rxcHC9KVmITzL",
    botId: "7461137983119949833",
    setBaseUrl(url: string) {
        this.url = url
    },
    setPat(pat: string) {
        this.pat = pat
    },
    setBotId(botId: string) {
        this.botId = botId
    },
}

export {
    coze
}