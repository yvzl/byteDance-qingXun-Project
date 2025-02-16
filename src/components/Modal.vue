<script setup lang="ts">
import {useModel} from "@/hooks";
import {Close} from '@icon-park/vue-next';

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  content?: string
  width?: string
  append?: string
  headerClass?: string
  bodyClass?: string
  footerClass?: string
  showClose?: boolean
  showFooter?: boolean
  showMask?: boolean
  showCancelButton?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  closeOnClickModal?: boolean
  confirmClose?: boolean
}>(), {
  title: "",
  content: "",
  width: "500px",
  append: "body",
  headerClass: "modal-header",
  bodyClass: "modal-body",
  footerClass: "modal-footer",
  showClose: true,
  showFooter: true,
  showMask: true,
  showCancelButton: true,
  confirmButtonText: "确定",
  cancelButtonText: "取消",
  closeOnClickModal: true,
  confirmClose: false,
})

const {modelValue, closeOnClickModal, confirmClose} = props

const emits = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const state = useModel(modelValue, props, "modelValue", emits, "update:modelValue")

const close = () => {
  emits('close')
  state.value = false
}

const maskClose = () => {
  if (!closeOnClickModal) return
  close()
}

const confirm = () => {
  emits('confirm')
  confirmClose && (state.value = false)
}

const cancel = () => {
  emits('cancel')
  state.value = false
}
</script>

<template>
  <Teleport :to="append">
    <transition name="fade">
      <div v-if="state" :style="{backgroundColor: showMask ? 'rgba(0, 0, 0, 0.6)' : 'transparent'}" class="modal"
           @click.self="maskClose">
        <div class="main" :style="{ width: width }">
          <div :class="['header', headerClass]">
            <span></span>
            <slot name="header">
              <p>{{ title }}</p>
            </slot>
            <span v-if="showClose" class="close" @click="close">
              <Close theme="outline" size="16"/>
            </span>
          </div>
          <div :class="['body', bodyClass]">
            <slot>{{ content }}</slot>
          </div>
          <div v-if="showFooter" :class="['footer', footerClass]">
            <slot name="footer">
              <button class="default" type="button" v-if="showCancelButton" @click="cancel">
                {{ cancelButtonText }}
              </button>
              <button class="primary" type="button" @click="confirm">{{ confirmButtonText }}</button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use "@/assets/styles/Modal.module";
</style>