<template>
  <custom-popup ref="popup">
    <div slot="content">
      <h1>비밀번호 찾기 화면</h1>
    </div>
  </custom-popup>
</template>

<script>
import CustomPopup from '@/components/CustomPopup';

export default {
  name: 'FindPasswordPopup',
  components: {
    CustomPopup,
  },
  methods: {
    openPopup() {
      this.$refs.popup.open();
    },
  },
};
</script>

<style lang="css"></style>
