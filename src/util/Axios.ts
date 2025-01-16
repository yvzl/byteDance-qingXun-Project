import Result from '../model/Result';
import axios, { Axios, } from 'axios';

class Service {
    private baseURL: string = "http://localhost:8080";
    private service: Axios;

    constructor() {
        // 创建axios实例
        this.service = axios.create({
            baseURL: this.baseURL, // api的base_url
            // timeout: 10000 // 请求超时时间
        });
        
    }
    public async get(url: string, params: any = null) : Promise<Result<any>>{
        let error: boolean = false;

        let res = await this.service.get(url, { params: params }).catch(() => {
            error = true;
        });

        if (!error) {
            return res as unknown as Result<any>;
        }else {
            return {
                code: 500,
                msg: '请求失败',
                data: null
            }
        }
    }
}
// 全局导出一个axios实例
export default new Service();
