export const copy = (str: string) => {
    navigator.clipboard.writeText(str).then()
    alert("复制成功")
}