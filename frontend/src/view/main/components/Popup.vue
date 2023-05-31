<template>
  <div v-if="visible" class="popup">
    <div v-if="hasTitle">
      <div class="myinfo-title ml_16 mt_32">
        <p class="fw_800 tal fs_20">
          <i :class="titleIcon"></i>
          {{ title }}
        </p>
      </div>
      <el-divider class="custom-divider" />
    </div>
    <div class="scrollable-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
export default {
  name: 'Popup',
  props: {
    title: {
      type: String,
      default: '',
    },
    titleIcon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /**
       * 팝업 display 여부
       */
      visible: false,
    };
  },
  computed: {
    hasTitle() {
      return !isEmpty(this.title);
    },
  },
  methods: {
    /**
     * 팝업 열기
     */
    open() {
      this.visible = true;
    },
    /**
     * 팝업 닫기
     */
    close() {
      if (!this.visible) return;
      this.visible = false;
      this.$emit('closed');
    },
  },
};
</script>
<style lang="css">
.popup {
  position: fixed;
  top: 50px;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: white;
}
.scrollable-content {
  position: fixed;
  width: 100%;
  height: 100%;
  background: white;
  overflow: auto;
  padding-bottom: 150px;
}
.custom-divider {
  margin-bottom: 0 !important;
}
</style>
