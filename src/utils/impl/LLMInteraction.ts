import {
  type BotInfo,
  ChatEventType,
  CozeAPI,
  type CreateChatData,
  type EnterMessage,
  type FileObject,
  RoleType,
} from '@coze/api';
import { config } from './config';
import  LLM  from './LLM';

class LLMInteraction implements LLM {
  
  private  Coze: CozeAPI | null = null;
  private  botInfo: BotInfo| undefined;
  private  fileInfoRef: FileObject | undefined;

  public  onSettingsChange() : void {
    this.initClient();
    this.getBotInfo();
  };

  private  initClient = () => {
    const baseUrl = config.getBaseUrl();
    const pat = config.getPat();
    this.Coze = new CozeAPI({
      token: pat,
      baseURL: baseUrl,
      allowPersonalAccessTokenInBrowser: true,
    });
  };
  //获取机器人信息
  private  getBotInfo = async () => {
    if (!this.Coze) {
      return;
    }
    const res = await this.Coze.bots.retrieve({
      bot_id: config.getBotId(),
    });
    this.botInfo = res;
  };

  public  createMessage = (query: string, fileInfo?: FileObject): EnterMessage[] => {
    const baseMessage: EnterMessage = {
      role: RoleType.User,
      type: 'question',
    };

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

    return [
      {
        ...baseMessage,
        content: [{ type: 'text', text: query }],
        content_type: 'text',
      },
    ];
  };

  public  streamingChat = async ({
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

    const botId = config.getBotId();
    const messages = this.createMessage(query, this.fileInfoRef);

    const v = await this.Coze.chat.stream({
      bot_id: botId,
      auto_save_history: true,
      additional_messages: messages,
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
  };

  public  chat = async (query: string): Promise<any> => {
    let response: any = null;
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
      return error;
    }
  };

  public  setConfig = (baseUrl: string, pat: string, botId: string) => {
    config.setBaseUrl(baseUrl);
    config.setPat(pat);
    config.setBotId(botId);
  };

  public  printSetting = () => {
    console.log('BaseUrl:', config.getBaseUrl());
    console.log('PAT:', config.getPat());
    console.log('BotId:', config.getBotId());
  };
}

export default LLMInteraction;
