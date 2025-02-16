/* debounce 函数用于限制函数的执行频率，确保在一系列连续的操作（如用户输入、窗口调整大小等）完成后只执行一次回调函数。
它通过延迟执行来实现这一点，如果在设定的时间间隔内再次触发操作，则重新计时。*/
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number = 1000): ((...args: Parameters<T>) => void) => {
    let timer: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, delay);
    };
};