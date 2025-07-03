import {type Ref} from "vue";

export const storeChange = <T>(data: Ref<T>) => (val: T) => data.value = val