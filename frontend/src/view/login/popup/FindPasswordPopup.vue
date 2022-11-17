<template>
  <div>
    <h1>비밀번호 찾기 화면</h1>
  </div>
</template>

<script>
export default {
  name: 'FindPasswordPopup',
  methods: {
    openPopup() {
      this.$refs.popup.open();
    },
  },
};
</script>

<style lang="css"></style>
