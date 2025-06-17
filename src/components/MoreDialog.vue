<script setup lang="ts">
import {messageStore} from "@/stores";
import {Delete, Edit} from '@icon-park/vue-next';
import type {IMessage} from "@/types";

const {deleteMessage, renameMessage} = messageStore();

const {id} = defineProps<{
  id: IMessage["id"]
  posX: number
  posY: number
  state: boolean
}>()

const remove = () => confirm("确认删除吗？") && deleteMessage(id)

const rename = () => {
  const input = prompt("请输入新名称。");
  if (!input) return;
  const regTest = /^\s+$/.test(input)
  if (!regTest) {
    renameMessage(id, input);
  } else {
    alert("名称不能为空")
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="state" class="more-dialog" :style="{left: `${posX}px`, top: `${posY}px`}">
        <ul>
          <li @click="rename">
            <Edit theme="outline" size="18"/>
            <span>重命名</span>
          </li>
          <li @click="remove" class="error">
            <Delete theme="outline" size="18"/>
            <span>删除</span>
          </li>
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use "@/assets/styles/MoreDialog.module";
</style>