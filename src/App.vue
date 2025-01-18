<script setup lang="ts">
import { CozeAPI } from '@coze/api';
import Coze from './components/CozeAPITest.vue';
import test from './components/test.vue';
</script>

<template>
  <div class="list">
    <test msg="大大"  />
  </div>

    <Coze_API_test>
      <div>

      <Coze />
sss
      </div>
    </Coze_API_test>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  
}
Coze_API_test{
  display: flex;
  position: absolute;
  top: 0;
  height: 100%;
  width: 20%;
  left: 0;
  background-color: #646cff38;
  justify-content: center;
}
</style>
