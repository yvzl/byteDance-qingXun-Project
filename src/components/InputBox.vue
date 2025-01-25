<!--InputBox.vue-->
<script setup lang="ts">
defineProps({
  msg: String
});
</script>

<template>
  <div class="input-box">
    <div>this is InputBox</div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>