export const copyCode = (str: string): string => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        doc.querySelectorAll("code").forEach((item: HTMLElement) => {
            const div = document.createElement("div");
            div.innerText = "复制";
            item.appendChild(div)
        })
        return doc.body.innerHTML;
    } catch (e) {
        console.error("str 不是一个有效的 DOM 字符串")
        return ""
    }
}