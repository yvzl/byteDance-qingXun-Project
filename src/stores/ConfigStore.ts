import {reactive} from 'vue'
import {defineStore} from "pinia";
import type {Request} from "@/types";

export const configStore = defineStore("", () => {
    const coze = reactive<Request>({
        url: "https://api.coze.cn",
        pat: "pat_8WQx7tAzEVlE812ldrdQJpkguRzUyhlNS49OPmzBNN8u1bgVH10CO6dfg59pnEYn",
        botId: "7444887625741434921",
    })

    return {
        coze,
    }
}, {
    persist: true,
})