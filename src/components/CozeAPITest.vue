<script setup lang="ts">
import { ref } from 'vue';
import { CozeAPI } from '@coze/api';

const apiClient = new CozeAPI({
  token: import.meta.env.VUE_APP_COZE_API_TOKEN,//由于个人令牌不能暴露在前端，否则会导致组件不加载，因此采取全局变量的方式引入
  baseURL: 'https://api.coze.cn',
  headers: {
    Authorization: `Bearer ${import.meta.env.VUE_APP_COZE_API_TOKEN}`,
  },
});

const response = ref<any>(null);
const error = ref<any>(null);

const testChat = async () => {
  try {
    const res = await apiClient.chat.stream({
      bot_id: '7461137983119949833',
    });
    response.value = res;
    console.log('API Response:', res);
  } catch (err) {
    error.value = err;
    console.error('API Error:', err);
  }
};
</script>

<template>
  <div class="coze-api-test">
    <h4>用于测试 API 返回结果</h4>

    <button @click="testChat">测试</button>

    <!-- 显示 API 响应 -->
    <pre v-if="response">{{ JSON.stringify(response, null, 2) }}</pre>

    <!-- 显示错误信息 -->
    <p v-if="error" style="color: red;">{{ error.message || 'An error occurred' }}</p>
  </div>
</template>

<style>
.coze-api-test {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>