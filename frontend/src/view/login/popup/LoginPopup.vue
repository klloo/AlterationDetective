<template>
  <div class="login_container">
    <div v-if="JoinPopup === false && Password === false">
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
        <input @keyup.enter="login" type="text" class="mail" placeholder="name@email.com" v-model="userEmail" />
        <input @keyup.enter="login" type="password" class="password" placeholder="비밀번호를 입력하세요." v-model="password" />
      </div>
      <!-- 자동로그인 -->
      <label class="checkbox mb_40">
        <input type="checkbox" />
        <span class="checkbox_icon mr_8"></span>
        <p>자동로그인</p>
      </label>
      <!-- 로그인 버튼 -->
      <div class="mb_24">
        <button @click="login" class="button_w100 blue color_w">로그인</button>
      </div>
      <!-- 비번찾기 & 회원가입 -->
      <div class="d_flex justify_between mb_24">
        <p>비밀번호를 잊으셨나요?</p>
        <p class="link_text" @click="Password = true">비밀번호 재설정</p>
      </div>
      <div class="d_flex justify_between">
        <p>아직 수선탐정 회원이 아니신가요?</p>
        <p class="link_text" @click="JoinPopup = true">회원가입</p>
      </div>
    </div>
    <div v-if="Password === true">
      <find-password-popup @home="Password = false"></find-password-popup>
    </div>
    <div v-if="JoinPopup === true">
      <join-popup @home="JoinPopup = false"></join-popup>
    </div>
  </div>
</template>

<script>
import '@/assets/css/Login.css';
import { isEmpty } from 'lodash';
import FindPasswordPopup from './FindPasswordPopup';
import JoinPopup from './JoinPopup';
import { login } from '@/api/user';

export default {
  name: 'LoginPopup',
  emits: ['home'],
  components: {
    JoinPopup,
    FindPasswordPopup,
  },
  data() {
    return {
      userEmail: '',
      password: '',
      JoinPopup: false,
      Password: false,
    };
  },
  methods: {
    login() {
      if (isEmpty(this.userEmail)) {
        this.$toast.info('이메일을 입력해주세요.');
        return;
      }
      if (isEmpty(this.password)) {
        this.$toast.info('비밀번호를 입력해주세요.');
        return;
      }
      const loginInfo = {
        userEmail: this.userEmail,
        password: this.password,
      };
      login(loginInfo)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            const userInfo = result.data;
            this.$store.dispatch('setUserInfo', userInfo);
            this.$router.push('/');
          } else {
            this.$toast.error(result.message);
          }
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

<style lang="css">
.login_container {
  margin-top: 63px;
}
</style>
