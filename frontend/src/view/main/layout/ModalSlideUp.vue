<template>
  <!-- <div :class="['modal_m', addClass]"> -->
  <!-- <div class="overlay_m"></div> -->
  <div :class="modalClassList" :style="modalStyle">
    <span class="height_handler" @click="closeModal" @animationend="this.$emit('closeModal')"></span>
    <div class="modal_header tal">
      <slot name="title"></slot>
      <span class="modal_close" @click="closeModal"></span>
    </div>
    <div class="modal_scrollable" :style="modalScrollableStyle">
      <slot />
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { remove } from 'lodash';
import '@/assets/css/modal.m.css';

export default {
  name: 'ModalView.m',
  props: {
    addClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      modalStyle: {},
      modalScrollableStyle: {},
      modalClassList: ['modal_card_m'],
    };
  },
  mounted() {
    const height = window.innerHeight * 0.9;
    this.modalStyle = {
      maxHeight: `${height}px`,
    };
    this.modalScrollableStyle = {
      maxHeight: `${height * 0.9 - 50}px`,
    };
    this.modalClassList.push('slide-up');
    document.body.classList.add('overflow_h');
  },
  beforeUnmount() {
    document.body.classList.remove('overflow_h');
  },
  methods: {
    closeModal() {
      remove(this.modalClassList, (item) => item === 'slide-up');
      this.modalClassList.push('slide-down');
    },
  },
};
</script>
<style scoped>
.height_handler {
  height: 3px;
  width: 56px;
  background: #000;
  display: inline-block;
}
.modal_close {
}
</style>
