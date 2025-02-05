export const copy = (str: string) => {
    navigator.clipboard.writeText(str).then(() => {
        console.log("已复制到剪贴板");
    }).catch(err => {
        console.error("复制失败", err);
    });
}