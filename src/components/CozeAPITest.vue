<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  type BotInfo,
  ChatEventType,
  CozeAPI,
  type CreateChatData,
  type EnterMessage,
  type FileObject,
  RoleType,
} from '@coze/api';

import { config } from '../util/config';

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
    botInfo.value=res;
  };

onBeforeMount(() => {
  initClient();
  config.initConfig();
});

const apiClient = new CozeAPI({
  token: import.meta.env.VUE_APP_COZE_API_TOKEN,//由于个人令牌不能暴露在前端，否则会导致组件不加载，因此采取全局变量的方式引入
  baseURL: 'https://api.coze.cn',
  allowPersonalAccessTokenInBrowser: true,
  headers: {
    Authorization: `Bearer ${import.meta.env.VUE_APP_COZE_API_TOKEN}`,
  },
});

const response = ref<any>(null);
const error = ref<any>(null);

//
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
  const messages = createMessage(query.value, fileInfoRef.value); // 创建消息对象
  
  const testChat = async () => {
  try {
    const v = await Coze.value?.chat.stream({
    bot_id: config.getBotId(), // 设置机器人 ID
    auto_save_history: true, // 自动保存对话历史
    additional_messages: messages, // 设置消息对象
  });
    response.value = v;
    console.log('API Response:', v);
  } catch (err) {
    error.value = err;
    console.error('API Error:', err);
  }
};

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
    <pre v-if="response">{{ JSON.stringify(response, null, 2) }}</pre>

    <!-- 显示错误信息 -->
    <p v-if="error" style="color: red;">{{ error.message || 'An error occurred' }}</p>
  </div>
  <form action="">
    <input type="text" placeholder="BaseUrl"></input>
    <input type="text" placeholder="PAT"></input>
    <input type="text" placeholder="BotId"></input>
  </form>
</template>

<style>
.coze-api-test {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>