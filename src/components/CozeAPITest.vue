<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import {
  type BotInfo,
  ChatEventType,
  CozeAPI,
  type CreateChatData,
  type EnterMessage,
  type FileObject,
  RoleType,
} from '@coze/api';

import {config} from '@/utils/config';

const Coze = ref<CozeAPI | null>(null);//这里声明Coze用于尝试调用API
const botInfo = ref<BotInfo>();
const fileInfoRef = ref<FileObject | undefined>();
const query = ref('你好');

const onSettingsChange = () => { //重新初始化 API 客户端。
  initClient();//初始化 API 客户端
  getBotInfo();//获取机器人信息
};
const initClient = () => {
  const baseUrl = config.getBaseUrl(); // 从配置中获取基础 URL
  const pat = config.getPat(); // 从配置中获取个人访问令牌 (PAT)
  Coze.value = new CozeAPI({
    token: pat, // 设置个人访问令牌
    baseURL: baseUrl, // 设置基础 URL
    allowPersonalAccessTokenInBrowser: true, // 允许在浏览器中使用个人访问令牌
  });
};

//获取机器人信息
const getBotInfo = async () => {
  if (!Coze.value) {
    return;
  }
  const res = await Coze.value.bots.retrieve({
    bot_id: config.getBotId(),
  });
  botInfo.value = res;
};

onBeforeMount(() => {
  initClient();
  config.initConfig();
});

const response = ref<any>(null);
const error = ref<any>(null);

//*
const createMessage = (
    query: string,
    fileInfo?: FileObject,
): EnterMessage[] => {
  const baseMessage: EnterMessage = {
    role: RoleType.User,
    type: 'question',
  };

  if (fileInfo) {
    return [
      {
        ...baseMessage,
        content: [
          {type: 'text', text: query},
          {type: 'file', file_id: fileInfo.id},
        ],
        content_type: 'object_string',
      },
    ];
  }

  return [
    {
      ...baseMessage,
      content: [{type: 'text', text: query}],
      content_type: 'text',
    },
  ];
};
const streamingChat = async ({
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
  if (!Coze.value) {
    return;
  }

  const botId = config.getBotId(); // 从配置中获取机器人 ID
  const messages = createMessage(query, fileInfoRef.value); // 创建消息对象

  const v = await Coze.value.chat.stream({
    bot_id: botId, // 设置机器人 ID
    auto_save_history: true, // 自动保存对话历史
    additional_messages: messages, // 设置消息对象
    conversation_id: conversationId, // 设置对话 ID（可选）
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
      const {role, type, content: msgContent} = part.data;
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
/*
const [agent] = useXAgent({
    request: ({ message: query }, { onUpdate, onSuccess }) => {
      const conversationId = activeKeyRef.current || '0';
      isTypingRef.current = true;
      
      //这里调用CozeAPI中定义的streamingChat，一大块片段都是传参
      streamingChat({
        query: query ?? '',
        conversationId: conversationId === '0' ? undefined : conversationId,
        onUpdate,
        onSuccess: (delta: string) => {
          onSuccess(delta);
          isTypingRef.current = false;
        },
        onCreated: (data: CreateChatData) => {
          setConversationsItems(prev => {
            const exist = prev.find(
              item => item.key === data.conversation_id || item.key === '0',
            );
            activeKeyRef.current = data.conversation_id;

            if (!exist) {
              return [
                ...prev,
                {
                  key: data.conversation_id,
                  label: query ?? '',
                },
              ];
            } else {
              if (exist.key === '0') {
                const newConversationsItems = prev.map(item => {
                  if (item.key === '0') {
                    return { key: data.conversation_id, label: query ?? '' };
                  }
                  return item;
                });

                return newConversationsItems;
              }
              return prev;
            }
          });
        },
      });

    },
  });
*/
const testChat = async () => {
  try {
    await streamingChat({
      query: query.value,
      onUpdate: (delta: string) => {
        response.value = delta;
      },
      onSuccess: (delta: string) => {
        response.value = delta;
      },
      onCreated: (data: CreateChatData) => {
        console.log('Chat created:', data);
      },
    });
  } catch (err) {
    error.value = err;
    console.error('API Error:', err);
  }
};

const setConfig = () => {
  config.setBaseUrl(baseUrlInput.value);
  config.setPat(patInput.value);
  config.setBotId(botIdInput.value);
};

const baseUrlInput = ref('');
const patInput = ref('');
const botIdInput = ref('');

const printSetting = () => {
  console.log('BaseUrl:', config.getBaseUrl());
  console.log('PAT:', config.getPat());
  console.log('BotId:', config.getBotId());
};
</script>

<template>
  <div class="coze-api-test">
    <h4>用于测试 API 返回结果</h4>

    <button @click="testChat">测试</button>
    <button @click="printSetting">查看三个配置信息</button>

    <!-- 显示 API 响应 -->
    <pre v-if="response">{{ response }}</pre>

    <!-- 显示错误信息 -->
    <p v-if="error" style="color: red;">{{ error.message || 'An error occurred' }}</p>
    <form @submit.prevent="setConfig">
      <input v-model="baseUrlInput" type="text" placeholder="BaseUrl"/>
      <br/>
      <input v-model="patInput" type="text" placeholder="PAT"/>
      <br/>
      <input v-model="botIdInput" type="text" placeholder="BotId"/>
      <br/>
      <button type="submit">设置配置</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/CozeAPITest.module";
</style>