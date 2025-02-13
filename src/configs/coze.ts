// 环境变量
const coze = {
    url: "https://api.coze.cn",
    pat: "pat_iKmuFMcHK1R0L7YyDNrrsZ71RsbdsK2NfTeKa3QVXwKR5q2nPN3rxcHC9KVmITzL",
    botId: "7461137983119949833",
    
    //使用localStorage存储这些配置项，默认值为预设的字符串或空字符串。提供三个方法getBaseUrl、getPat和getBotId来获取对应的配置值。
    /*getBaseUrl: () => localStorage.getItem('baseUrl') || '',
    getPat: () => localStorage.getItem('PAT') || '',
    getBotId: () => localStorage.getItem('BotId') || '',*/
    setBaseUrl(url: string){
        this.url = url
    },
    setPat(pat: string){
        this.pat = pat
    },
    setBotId(botId: string){
        this.botId = botId
    },
}

export {
    coze
}