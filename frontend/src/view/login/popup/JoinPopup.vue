<template>
  <div>
    <h1>회원가입 화면</h1>
    <button @click="close">닫기</button>
  </div>
</template>

<script>
export default {
  name: 'JoinView',
  methods: {
    close() {
      this.$emit('close-popup');
    },
  },
};
</script>

<style lang="css"></style>
