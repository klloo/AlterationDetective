<template>
  <div>
    <div v-if="JoinPopup === false">
      <!-- 뒤로가기 이미지 -->
      <div class="mb_32">
        <span class="BACKARR" @click="$emit('home')"></span>
      </div>
      <!-- 백그라운드 이미지 -->
      <div class="mb_40">
        <span class="LOGIN_IMG mx_0a"></span>
      </div>
      <!-- 로그인 input -->
      <p class="title">Login</p>
      <div class="input_box">
        <div>
          <input type="text" class="mail" placeholder="name@email.com" v-model="userId" />
        </div>
        <div>
          <input type="password" class="password" placeholder="비밀번호를 입력하세요." v-model="password" />
        </div>
      </div>
      <!-- 자동로그인 -->
      <div class="d_flex align_center mb_40">
        <input type="checkbox" class="checkbox" />
        <p>자동로그인</p>
      </div>
      <!-- 로그인 버튼 -->
      <div class="mb_24">
        <button @click="login" class="button01 blue color_w">로그인</button>
      </div>
      <!-- 비번찾기 & 회원가입 -->
      <div class="d_flex justify_between mb_24">
        <p>비밀번호를 잊으셨나요?</p>
        <router-link to="#" class="link_text">비밀번호 재설정</router-link>
      </div>
      <div class="d_flex justify_between">
        <p>아직 수선탐정 회원이 아니신가요?</p>
        <p class="link_text" @click="JoinPopup = true">회원가입</p>
      </div>
    </div>
    <div v-if="JoinPopup === true">
      <JoinPopup @home="JoinPopup = false"></JoinPopup>
    </div>
  </div>
</template>

<script>
import '@/assets/css/Login.css';
import JoinPopup from './JoinPopup.vue';
import { login } from '@/api/user';

export default {
  name: 'LoginPopup',
  emits: ['home'],
  components: {
    JoinPopup,
  },
  data() {
    return {
      userId: '',
      password: '',
      JoinPopup: false,
    };
  },
  methods: {
    login() {
      const loginInfo = {
        userId: this.userId,
        password: this.password,
      };
      login(loginInfo)
        .then((data) => {
          const userInfo = data.data;
          this.$store.dispatch('setUserInfo', userInfo);
          this.$router.push('/');
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    openPopup() {
      this.$refs.popup.open();
    },
  },
};
</script>

<style lang="css"></style>
