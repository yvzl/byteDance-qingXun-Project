// 环境变量
const coze = {
    url: import.meta.env.VITE_COZE_API,
    pat: import.meta.env.VITE_COZE_PAT,
    botId: import.meta.env.VITE_COZE_BOTID,
    
    //使用localStorage存储这些配置项，默认值为预设的字符串或空字符串。提供三个方法getBaseUrl、getPat和getBotId来获取对应的配置值。
    getBaseUrl: () => localStorage.getItem('baseUrl') || '',
    getPat: () => localStorage.getItem('PAT') || '',
    getBotId: () => localStorage.getItem('BotId') || '',
    setBaseUrl: (url: string) => localStorage.setItem('baseUrl', url),
    setPat: (pat: string) => localStorage.setItem('PAT', pat),
    setBotId: (botId: string) => localStorage.setItem('BotId', botId),
}

export {
    coze
}