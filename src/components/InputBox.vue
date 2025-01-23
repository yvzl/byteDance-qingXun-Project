<!--InputBox.vue-->
<script setup lang="ts">
//import { ref } from 'vue';
defineProps({
    msg: String
});
</script>

<template>
    <div>this is InputBox</div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InputBox.module";
</style>