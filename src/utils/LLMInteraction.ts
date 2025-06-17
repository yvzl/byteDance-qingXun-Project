import {toRefs} from "vue";
import {storeToRefs} from "pinia";
import {messageStore, configStore} from '@/stores';
import {
    type BotInfo,
    ChatEventType,
    CozeAPI,
    type CreateChatData,
    type EnterMessage,
    RoleType,
} from '@coze/api';
import type {LLM} from '@/types';

const message = messageStore();
const config = configStore();
const {getContentLength, findMessage} = message;
const {activeMessageId} = storeToRefs(message);
const {coze} = storeToRefs(config)
const {url, pat, botId} = toRefs(coze.value)

class LLMInteraction implements LLM {
    private Coze: CozeAPI | null = null;
    private botInfo: BotInfo | undefined;

    constructor() {
        this.initClient();
        this.getBotInfo().then();
    }

    public onSettingsChange(): void {
        this.initClient();
        this.getBotInfo().then();
    }

    public initClient = () => {
        this.Coze = new CozeAPI({
            token: pat.value,
            baseURL: url.value,
            allowPersonalAccessTokenInBrowser: true,
        });
    }

    private getBotInfo = async () => {
        if (!this.Coze) return;
        this.botInfo = await this.Coze.bots.retrieve({bot_id: botId.value});
    }

    public createMessage = (): EnterMessage[] => {
        const res: EnterMessage[] = [];
        const message = findMessage(activeMessageId.value)
        if (!message) return [];
        const foundContent = message.content;
        if (Array.isArray(foundContent)) {
            for (let i = 0; i < getContentLength(activeMessageId.value); i++) {
                if (foundContent[i].fileInfo) {
                    res.push({
                        role: foundContent[i].role as unknown as RoleType,
                        content: [
                            {type: 'file', file_id: foundContent[i].fileInfo?.id || ''},
                            {type: 'text', text: foundContent[i].value},
                        ],
                        content_type: 'object_string',
                    });
                } else {
                    res.push({
                        role: foundContent[i].role as unknown as RoleType,
                        content: [
                            {type: 'text', text: foundContent[i].value},
                        ],
                        content_type: 'text',
                    });
                }
            }
        }
        return res;
    }

    public streamingChat = async ({conversationId, onUpdate, onSuccess, onCreated}: {
        query: string;
        conversationId?: string;
        onUpdate: (delta: string) => void;
        onSuccess: (delta: string) => void;
        onCreated: (data: CreateChatData) => void;
    }) => {
        if (!this.Coze) return;
        let messages = this.createMessage();
        const v = this.Coze.chat.stream({
            bot_id: botId.value,
            auto_save_history: true,
            additional_messages: messages,
            conversation_id: conversationId,
        });
        let msg = '';
        for await (const part of v) {
            if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
                onCreated(part.data);
            } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                msg += part.data.content;
                onUpdate(msg);
            } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
                const {role, type} = part.data;
                if (role === 'assistant' && type === 'answer') {
                    msg += '\n';
                    onSuccess(msg);
                }
            }
        }
    }
}

const LLM = new LLMInteraction();

export {
    LLM
}


