<template>
  <div>
    <h1>비밀번호 찾기 화면</h1>
    <button @click="close">닫기</button>
  </div>
</template>

<script>
export default {
  name: 'FindPasswordView',
  methods: {
    close() {
      this.$emit('close-popup');
    },
  },
};
</script>

<style lang="css"></style>
