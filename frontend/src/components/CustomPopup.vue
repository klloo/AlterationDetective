<template>
  <div :class="['popup-view', isOpen ? 'active' : '']">
    <button @click="close">닫기</button>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'CustomPopup',
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    },
  },
};
</script>

<style>
.popup-view {
  opacity: 0;
  display: none;
  visibility: hidden;
}
.active {
  opacity: 1;
  display: block;
  visibility: visible;
}
</style>
