<template>
    <div>this is {{msg}}</div>
</template>
<script setup lang="ts">
//import { ref } from 'vue';
defineProps({
    msg: String
});
</script>