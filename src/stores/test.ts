import {ref} from 'vue'
import {defineStore} from "pinia";

export const testStore = defineStore("testStore", () => {
    const data = ref<string>("data")
    const fn = () => console.log(1)

    return {
        data,
        fn
    }
}, {
    persist: true,
})