<!--IndependentDialog.vue-->
<script setup lang="ts">
import InputBox from '@/components/InputBox.vue';
import MessageList from '@/components/MessageList.vue';
//import { ref } from 'vue';
defineProps({
    msg: String
});
</script>

<template>
    <div class="main">
      <div class="message-list">
        <MessageList />
      </div>
      <div class="input-box">
        <InputBox />
      </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/IndependentDialog.module";
.main{
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
}

.message-list {
height: 60%;
width: 100%;
overflow-y: scroll;
background-color: #646cff38;

}

.input-box {
width: 100%;
height: 20%;
background-color: #646cff38;
}
</style>