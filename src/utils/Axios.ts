import axios, {AxiosInstance,} from 'axios';
import {coze} from "@/configs"

const {url, pat, botId} = coze

// 创建Axios实例
const apiClient: AxiosInstance = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pat}`,
    },
});


// 封装请求方法
const createChat = async (data: any, conversationId?: string) => {
    const url = conversationId
        ? `/bots/${botId}/conversations/${conversationId}/messages`
        : `/bots/${botId}/conversations`;
    try {
        const response = await apiClient.post(url, data);
        return response.data;
    } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
    }
};

const streamChat = async (data: any, conversationId?: string) => {
    const url = conversationId
        ? `/bots/${botId}/conversations/${conversationId}/messages/stream`
        : `/bots/${botId}/conversations/messages/stream`;
    try {
        const response = await apiClient.post(url, data, {
            responseType: 'stream',
        });
        return response.data;
    } catch (error) {
        console.error('Error streaming chat:', error);
        throw error;
    }
};

export {
    createChat,
    streamChat,
}