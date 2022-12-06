<template>
  <div>
    <h1>마이페이지 화면</h1>
    <button @click="logout">로그아웃</button>
  </div>
</template>

<script>
import { logout } from '@/api/user';

export default {
  name: 'MyPageView',
  methods: {
    logout() {
      logout().then((data) => {
        if (data.data.success) {
          this.$store.dispatch('setUserInfo', {});
          this.$router.go(this.$router.currentRoute);
        }
      });
    },
  },
};
</script>

<style lang="css"></style>
