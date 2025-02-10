import {ref, watch, type Ref, type DefineProps, type EmitFn} from "vue"

// 父子双向绑定钩子
export const useModel = <T>(value: T, props: DefineProps<{
    [key: string]: any
}, never>, propsName: string, emit: EmitFn<string, any>, emitName: string): Ref<T> => {
    let state = false
    const data: Ref<T> = ref<T>(value) as Ref<T>
    watch(() => props[propsName], newVal => {
        state && (data.value = newVal)
    }, {deep: true})
    watch(data, newVal => {// 双向绑定，每当 data 改变时，调用 emit
        state = false
        emit(emitName, newVal)
        state = true
    }, {deep: true})
    return data
}