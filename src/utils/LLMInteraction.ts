import axios from 'axios';
import {
    type BotInfo,
    ChatEventType,
    CozeAPI,
    type CreateChatData,
    type EnterMessage,
    type FileObject,
    RoleType,
} from '@coze/api';
import { coze } from "@/configs"
import LLM from './LLM.TS';
import { messageStore } from '@/stores/MessageStore';
import { storeToRefs } from "pinia";

/*LLM是调用API的工具类*/
class LLMInteraction implements LLM {
    private Coze: CozeAPI | null = null;
    private botInfo: BotInfo | undefined;
    private fileInfoRef: FileObject | undefined;

    constructor() {
        this.initClient();
        this.getBotInfo();
    }

    public onSettingsChange(): void {
        this.initClient();
        this.getBotInfo();
    }

    private initClient = () => {
        const { url, pat } = coze
        this.Coze = new CozeAPI({
            token: pat,
            baseURL: url,
            allowPersonalAccessTokenInBrowser: true,
        });
    }

    private getBotInfo = async () => {
        if (!this.Coze) return;
        const { botId } = coze
        this.botInfo = await this.Coze.bots.retrieve({ bot_id: botId });
    }

    /*createMessage是streamingChat的辅助函数统一打包当前会话的上下文*/ 
    public createMessage = (): EnterMessage[] => {
        const store = messageStore();
        const { getContentLength, findContent } = store;
        const { activeMessageId } = storeToRefs(store);

        const res: EnterMessage[] = [];

        const foundContent = findContent(activeMessageId.value);
        if (Array.isArray(foundContent)) {
            for (let i = 0; i < getContentLength(activeMessageId.value); i++) {
                if (foundContent[i].fileInfo) {
                     console.log('emitFileInfoFunc', foundContent[i].fileInfo);

                    res.push({
                        role: foundContent[i].role as unknown as RoleType,
                        content: [
                            { type: 'file', file_id: foundContent[i].fileInfo?.id || '' }, //在uploadFile之后Coze会通过该id获取文件信息
                            { type: 'text', text: foundContent[i].value },
                            
                        ],
                        content_type: 'object_string',
                    });
                } else {
                    res.push({
                        role: foundContent[i].role as unknown as RoleType,
                        content: [
                            { type: 'text', text: foundContent[i].value },
                        ],
                        content_type: 'text',
                    });
                }
            }
        }
        console.log('本次对话上下文:', res);
        return res;
    }
    
/*这里将file打包成formData，其实可以添加多个文件，但这里只打包一个文件，然后通过axios将文件集合post到Coze */
    public uploadFile = async (file?: File): Promise<FileObject | undefined> => { //参考这里 https://www.coze.cn/open/playground/upload_file
        if (!this.Coze) {
            throw new Error('Client not initialized');
        }
        if (!file) {
            this.fileInfoRef = undefined;
            return;
        }
        console.log('Uploading file');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${this.Coze.baseURL}/v1/files/upload`, formData, {//原有的Coze方法返回不完全，只能返回infoData，但其实还包括code，因此改成axios请求
                headers: {
                    'Authorization': `Bearer ${this.Coze.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            this.fileInfoRef = response.data.data;
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            console.log('File uploaded');
        }

        return this.fileInfoRef;
    }


    /*streamingChat是调用API的核心函数，调用Coze的chat.stream方法，并返回一个异步迭代器。*/ 
    public streamingChat = async ({
        query,//query原本是本次对话的输入，但是项目通过仓库来获取上下文，因此这里没有调用
        conversationId,
        onUpdate,
        onSuccess,
        onCreated,
    }: {
        query: string;
        conversationId?: string;
        onUpdate: (delta: string) => void;
        onSuccess: (delta: string) => void;
        onCreated: (data: CreateChatData) => void;
    }) => {
        if (!this.Coze) {
            return;
        }
        const { botId } = coze
        let messages = this.createMessage();

        const v = await this.Coze.chat.stream({
            bot_id: botId,
            auto_save_history: true,
            additional_messages: messages,// 如果 additional_messages 中有多条消息，则最后一条会作为本次用户 Query，其他消息为上下文。
            conversation_id: conversationId,
        });
        console.log('API Response:', v);

        let msg = '';

        for await (const part of v) {
            if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
                console.log('[START]');
                onCreated(part.data);
            } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                msg += part.data.content;
                onUpdate(msg);
            } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
                const { role, type, content: msgContent } = part.data;
                if (role === 'assistant' && type === 'answer') {
                    msg += '\n';
                    onSuccess(msg);
                } else {
                    console.log('[%s]:[%s]:%s', role, type, msgContent);
                }
            } else if (part.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
                console.log(part.data.usage);
            } else if (part.event === ChatEventType.DONE) {
                console.log(part.data);
            }
        }
        console.log('=== End of Streaming Chat ===');
    }



    public setConfig = (baseUrl: string, pat: string, botId: string) => {
        coze.setBaseUrl(baseUrl);
        coze.setPat(pat);
        coze.setBotId(botId);
    }

    public printSetting = () => {
        console.log('BaseUrl:', coze.url);
        console.log('PAT:', coze.pat);
        console.log('BotId:', coze.botId);
    }
}

export default new LLMInteraction();


