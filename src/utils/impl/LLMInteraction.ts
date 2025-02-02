import {
    type BotInfo,
    ChatEventType,
    CozeAPI,
    type CreateChatData,
    type EnterMessage,
    type FileObject,
    RoleType,
} from '@coze/api';
import { config } from '../config';
import {coze} from "@/configs"
import LLM from '../LLM';
import { messageStore } from '@/stores/Message';
import { storeToRefs } from "pinia";

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
        const {url, pat} = coze
        this.Coze = new CozeAPI({
            token: pat,
            baseURL: url,
            allowPersonalAccessTokenInBrowser: true,
        });
    }

    private getBotInfo = async () => {
        if (!this.Coze) return;
        const {botId} = coze
        this.botInfo = await this.Coze.bots.retrieve({bot_id: botId});
    }

    public createMessage = (query: string, fileInfo?: FileObject): EnterMessage[] => {
        const store = messageStore();
        const { updateContent, getContentLength, findContent } = store;
        const { activeMessageId } = storeToRefs(store);

        const baseMessage: EnterMessage = {
            role: RoleType.User,
            type: 'question',
        };
        
        const res: EnterMessage[] = [];
        for (let i = 0; i < getContentLength(activeMessageId.value); i++) {
            const foundContent = findContent(activeMessageId.value);
            if (Array.isArray(foundContent) && foundContent[i]?.value) {
                res.push({
                    role: foundContent[i].role as unknown as RoleType,  //https://www.coze.cn/open/docs/developer_guides/create_conversation 参考这里实现上下文联系
                    //https://www.coze.cn/open/docs/developer_guides/chat_v3#2bb94adb 参考这里实现携带上下文
                    
                    content: [
                        { type: 'text', text: foundContent[i].value },
                    ],
                    content_type: 'text',
                });
            }
        }
        console.log('res: EnterMessage[]:', res);


        if (fileInfo) {
            return [
                {
                    ...baseMessage,
                    content: [
                        { type: 'text', text: query },
                        { type: 'file', file_id: fileInfo.id },
                    ],
                    content_type: 'object_string',
                },
            ];
        }

        return res;
    }

    public uploadFile = async (file?: File) => {
        if (!this.Coze) {
            throw new Error('Client not initialized');
        }
        if (!file) {
            this.fileInfoRef = undefined;
            return;
        }
        console.log('Uploading file');
        this.fileInfoRef = await this.Coze.files
            .upload({
                file,
            })
            .finally(() => {
                console.log('File uploaded');
            });
    }

    public streamingChat = async ({
        query,
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
        const {botId} = coze
        const messages = this.createMessage(query, this.fileInfoRef);

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

    public chat = async (query: string, fileInfoRef?: File | undefined): Promise<string> => {

        let response: string = '';
        let error: any = null;
        try {
            await this.streamingChat({
                query,
                onUpdate: (delta: string) => {
                    response = delta;
                },
                onSuccess: (delta: string) => {
                    response = delta;
                },
                onCreated: (data: CreateChatData) => {
                    console.log('Chat created:', data);
                },
            });
            return response;
        } catch (err) {
            error = err;
            console.error('API Error:', err);
            throw error;
        }
    }

    public setConfig = (baseUrl: string, pat: string, botId: string) => {
        config.setBaseUrl(baseUrl);
        config.setPat(pat);
        config.setBotId(botId);
    }

    public printSetting = () => {
        console.log('BaseUrl:', config.getBaseUrl());
        console.log('PAT:', config.getPat());
        console.log('BotId:', config.getBotId());
    }
}

export default new LLMInteraction();


