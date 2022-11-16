<template>
  <custom-popup ref="popup">
    <div slot="content">
      <h1>로그인 화면</h1>
      <div>ID <input type="text" v-model="userId" /></div>
      <div>PW <input type="password" v-model="password" /></div>
      <button @click="login">Login</button>
    </div>
  </custom-popup>
</template>

<script>
import CustomPopup from '@/components/CustomPopup';
import { login } from '@/api/user';

export default {
  name: 'LoginView',
  components: {
    CustomPopup,
  },
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
    openPopup() {
      this.$refs.popup.open();
    },
  },
};
</script>

<style lang="css"></style>
