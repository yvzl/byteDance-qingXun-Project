interface Result<T> {
    code: number;
    data: T;
    msg: string;
}
//这里的Result类型，是返回给前端的json数据格式，配合Axios
export default Result;