<template>
  <div>
    <h1>초기 페이지</h1>
    <button @click="open('LoginPopup')">로그인</button>
    <button @click="open('JoinPopup')">회원가입</button>
    <button @click="open('FindPasswordPopup')">비밀번호 찾기</button>
    <component :is="currentComponent" :class="['popup-view', isOpen ? 'active' : '']" ref="popupComponent" />
  </div>
</template>

<script>
import { login } from '@/api/user';
import LoginPopup from './popup/LoginPopup';
import JoinPopup from './popup/JoinPopup';
import FindPasswordPopup from './popup/FindPasswordPopup';

export default {
  name: 'Login',
  components: {
    LoginPopup,
    JoinPopup,
    FindPasswordPopup,
  },
  data() {
    return {
      isOpen: false,
      currentComponent: null,
    };
  },
  methods: {
    open(component) {
      this.currentComponent = component;
      this.$nextTick(() => {
        this.$refs.popupComponent.openPopup();
      });
    },
    close() {},
  },
};
</script>

<style lang="css"></style>
