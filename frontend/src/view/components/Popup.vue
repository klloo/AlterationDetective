<template>
  <el-drawer :visible.sync="visible" size="100%" :with-header="false">
    <!-- 뒤로가기 이미지 -->
    <el-row class="mt_24 ml_16">
      <div :class="`${titleClass} d_flex align_center`" @click="close">
        <span class="BACKARR mr_16"></span>
        <span class="fw_400 fs_20"> {{ title }} </span>
      </div>
    </el-row>
    <div :class="contentClass">
      <slot name="content" />
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    title: {
      type: String,
    },
    type: {
      type: String,
      default: 'default',
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
    titleClass() {
      if (this.type === 'search') return 'mb_16';
      return 'mb_32';
    },
    contentClass() {
      if (this.type === 'search') return 'mr_12 ml_12';
      return 'mr_32 ml_32';
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
      this.visible = false;
      this.$emit('closed');
    },
  },
};
</script>
<style lang="css"></style>
