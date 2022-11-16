<template>
  <div>
    <h1>로그인 화면</h1>
    <div>ID <input type="text" v-model="userId" /></div>
    <div>PW <input type="password" v-model="password" /></div>
    <button @click="login">Login</button>
    <button @click="close">닫기</button>
  </div>
</template>

<script>
import { login } from '@/api/user';

export default {
  name: 'LoginView',
  data() {
    return {
      userId: '',
      password: '',
    };
  },
  methods: {
    login() {
      const loginInfo = {
        userId: this.userId,
        password: this.password,
      };
      login(loginInfo).then((data) => {
        const userInfo = data.data;
        this.$store.dispatch('setUserInfo', userInfo);
        this.$router.push('/');
      });
    },
    close() {
      this.$emit('close-popup');
    },
  },
};
</script>

<style lang="css"></style>
