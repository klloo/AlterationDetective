<template>
  <div ref="card" class="modal_card_m" :style="{ height: `${isMove ? y : calcY()}px` }">
    <div ref="pan">
      <span class="top_bar"></span>
      <div class="modal_header mt_16">
        <slot name="open-title" v-if="this.state === 'open'"></slot>
        <slot name="close" v-if="this.state === 'close'" />
        <span class="modal_close"></span>
      </div>
    </div>
    <div class="modal_scrollable">
      <slot name="open" v-if="this.state === 'open'" />
    </div>
  </div>
</template>

<script>
import Hammer from 'hammerjs';
import '@/assets/css/modal.m.css';

export default {
  name: 'ModalView.m',
  data() {
    return {
      mc: null,
      y: 0,
      startY: 0,
      isMove: false,
      state: 'close',
    };
  },
  mounted() {
    this.mc = new Hammer(this.$refs.pan);
    this.mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    this.mc.on('panup pandown', (evt) => {
      this.y = window.innerHeight - evt.center.y;
    });

    this.mc.on('panstart', (evt) => {
      this.startY = evt.center.y;
      this.isMove = true;
    });

    this.mc.on('panend', (evt) => {
      this.isMove = false;
      if (this.startY - evt.center.y > 120) {
        this.state = 'open';
      }
      if (this.startY - evt.center.y < 0) {
        this.state = 'close';
      }
    });
  },
  beforeDestroy() {
    this.mc.destroy();
  },
  methods: {
    calcY() {
      switch (this.state) {
        // 닫은 상태 일 때 높이
        case 'close':
          return window.innerHeight * 0.1;
        // 연 상태 일 때 높이
        case 'open':
          return window.innerHeight * 0.78;
        default:
          return this.y;
      }
    },
  },
};
</script>
<style scoped>
.top_bar {
  height: 3px;
  width: 56px;
  background: #8e8e8e;
  border-radius: 3px;
  display: inline-block;
}
</style>
