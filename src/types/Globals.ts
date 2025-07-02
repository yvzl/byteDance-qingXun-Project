type ToMap<T extends {id: string}> = Record<T["id"], T>

export {
    ToMap
}