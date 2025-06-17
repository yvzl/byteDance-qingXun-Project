import {reactive, toRefs} from 'vue'
import {defineStore} from "pinia";
import type {Request} from "@/types";

export const configStore = defineStore("", () => {
    const coze = reactive<Request>({
        url: import.meta.env.VITE_COZE_API,
        pat: import.meta.env.VITE_COZE_PAT,
        botId: import.meta.env.VITE_COZE_BOTID,
    })

    const {url, pat, botId} = toRefs(coze)

    const changeUrl = (_url: string) => url.value = _url

    const changePat = (_pat: string) => pat.value = _pat

    const changeBotId = (_botId: string) => botId.value = _botId

    return {
        coze,
        changeUrl,
        changePat,
        changeBotId
    }
}, {
    persist: true,
})