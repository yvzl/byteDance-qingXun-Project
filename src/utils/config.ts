//提供全局配置项，如API的基础URL、个人访问令牌（PAT）和机器人ID。
export const config = {
    //先将设置参数写死进行测试
    initConfig(): void {
        localStorage.setItem('baseUrl', 'https://api.coze.cn');
        localStorage.setItem('PAT', 'pat_iKmuFMcHK1R0L7YyDNrrsZ71RsbdsK2NfTeKa3QVXwKR5q2nPN3rxcHC9KVmITzL');
        localStorage.setItem('BotId', '7461137983119949833');
    },
    //使用localStorage存储这些配置项，默认值为预设的字符串或空字符串。提供三个方法getBaseUrl、getPat和getBotId来获取对应的配置值。
    getBaseUrl: () =>
        localStorage.getItem('baseUrl') || '',
    getPat: () => localStorage.getItem('PAT') || '',
    getBotId: () => localStorage.getItem('BotId') || '',
    setBaseUrl: (url: string) => localStorage.setItem('baseUrl', url),
    setPat: (pat: string) => localStorage.setItem('PAT', pat),
    setBotId: (botId: string) => localStorage.setItem('BotId', botId),
};


