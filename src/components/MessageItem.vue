<!--MessageItem.vue-->
<script setup lang="ts">
//import { ref } from 'vue';
defineProps({
    msg: String
});
</script>

<template>
    <div>this is MessageItem</div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MessageItem.module";
</style>