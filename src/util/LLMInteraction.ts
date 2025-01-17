import Service from './Axios'; // 引入 axios 实例
import { CozeAPI } from '@coze/api';

class LLMInteraction {
    // Our official coze sdk for JavaScript [coze-js](https://github.com/coze-dev/coze-js)

    private static token = 'YOUR_TOKEN';


    constructor() {
        
    }

    // 发送消息到 Coze 大模型 API 的方法
    public static async sendMessage(input: string): Promise<any> {
        const url = '/api/llm'; // 假设 Coze API 的路径为 /api/llm
        const params = { input: input };
        try {
            const response = await Service.get(url, params);
            return response.data; // 返回 API 的响应数据
        } catch (error) {
            console.error('Error calling Coze API:', error);
            throw error;
        }
    }

    // test 方法接收用户输入并调用 sendMessage 方法
    public static async test(input: string): Promise<any> {
        return await this.sendMessage(input);
    }
}
export default LLMInteraction;