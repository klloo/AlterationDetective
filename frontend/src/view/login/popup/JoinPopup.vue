<template>
  <custom-popup ref="popup">
    <div slot="content">
      <h1>회원가입 화면</h1>
    </div>
  </custom-popup>
</template>

<script>
import CustomPopup from '@/components/CustomPopup';

export default {
  name: 'JoinPopup',
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
