import axios, { AxiosInstance,  } from 'axios';
import { config } from './config';

// 创建Axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: config.getBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.getPat}`,
    
  },
  
});


// 封装请求方法
export const createChat = async (data: any, conversationId?: string) => {
  const url = conversationId
    ? `/bots/${config.getBotId}/conversations/${conversationId}/messages`
    : `/bots/${config.getBotId}/conversations`;
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const streamChat = async (data: any, conversationId?: string) => {
  const url = conversationId
    ? `/bots/${config.getBotId}/conversations/${conversationId}/messages/stream`
    : `/bots/${config.getBotId}/conversations/messages/stream`;
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
