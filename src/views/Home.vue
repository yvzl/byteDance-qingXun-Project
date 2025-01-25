<script setup lang="ts">
import Coze from '@/components/CozeAPITest.vue';

import IndependentDialog from '@/components/IndependentDialog.vue';
import DialogContainer from '@/components/DialogContainer.vue';
</script>

<template>
  <Coze_API_test>
    <div>
      <Coze />
    </div>
  </Coze_API_test>

  <div class="home">
    <div class="main">
      <div class="header">
        <DialogContainer /> <!-- 这里是内联对话框 --->
      </div>
      <IndependentDialog />
    </div>


  </div>



</template>

<style scoped>
body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.home {
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.main{
  border: #646cff38 1px solid;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


}

Coze_API_test {
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
