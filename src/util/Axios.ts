import Result from '../model/Result';
import axios, { Axios, } from 'axios';
import { CozeAPI } from '@coze/api';


// 手动声明模块类型（如果需要）
// declare module '@coze/api' {
//     export class CozeAPI {
//         constructor(options: { token: string; baseURL: string });
//         chat: {
//             stream(options: { bot_id: string; user_id: string }): Promise<any>;
//         };
//     }
// }

const apiClient = new CozeAPI({
    token: '{token}', // 确保替换为实际的 token
    baseURL: 'https://api.coze.cn'
});

const res = await apiClient.chat.stream({
    bot_id: '{bot_id}', // 确保替换为实际的 bot_id
    user_id: '{user_id}' // 确保替换为实际的 user_id
});
class Service {
    private baseURL: string = "http://localhost:8080";
    private service: Axios;

    
    constructor() {
        // 创建axios实例
        this.service = axios.create({
            baseURL: this.baseURL, // api的base_url
            timeout: 10000 // 请求超时时间
        });
    }
    public async get(url: string, params: any = null): Promise<Result<any>> {
        try {
            const response = await this.service.get(url, { params });
            return response.data as Result<any>;
        } catch (error) {
            return {
                code: 500,
                msg: '请求失败',
                data: null
            };
        }
    }
}
// 全局导出一个axios实例
export default new Service();