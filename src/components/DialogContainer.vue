<!--DialogContainer.vue-->
<script setup lang="ts">
//import { ref } from 'vue';
defineProps({
    msg: String
});
</script>

<template>
    <div>this is DialogContainer</div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/DialogContainer.module";
</style>