<script setup lang="ts">
import {useTemplateRef} from "vue";
import {More} from '@icon-park/vue-next';
import type {Message} from "@/types";

const more = useTemplateRef<HTMLDivElement>("more")

const {id} = defineProps<{ id: Message["id"] }>()

const emits = defineEmits(["moreClick"])

const click = () => {
  if (!more.value) return
  const {offsetLeft, offsetTop} = more.value
  emits("moreClick", id, offsetLeft + 35, offsetTop)
}
</script>

<template>
  <div class="more" @click.stop="click" ref="more">
    <More theme="outline" size="24"/>
  </div>
</template>