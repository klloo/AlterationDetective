<template>
  <div>
    <div class="login_container">
      <!-- 백그라운드 이미지 -->
      <el-row class="mb_40 mt_100">
        <span class="LOGIN_IMG mx_0a"></span>
      </el-row>
      <!-- 로그인 input -->
      <el-row class="input_box mt_64 mb_16 mr_32 ml_32">
        <el-input
          prefix-icon="el-icon-message"
          class="custom_input mb_12"
          @keyup.enter="login"
          type="text"
          placeholder="name@email.com"
          v-model="userEmail"
        />
        <el-input prefix-icon="el-icon-key" @keyup.enter="login" type="password" placeholder="비밀번호를 입력하세요." v-model="password" />
      </el-row>
      <!-- 자동로그인 -->
      <el-checkbox class="checkbox ml_32 mb_24"> 자동 로그인 </el-checkbox>
      <!-- 로그인 버튼 -->
      <div class="mb_64 mr_32 ml_32">
        <button @click="login" class="button_w100 blue color_w">로그인</button>
      </div>
      <!-- 비번찾기 & 회원가입 -->
      <div class="d_flex justify_between mb_8 ml_40 mr_40">
        <p class="info_text">비밀번호를 잊으셨나요?</p>
        <p class="link_text" @click="openPasswordPopup">비밀번호 재설정</p>
      </div>
      <div class="d_flex justify_between mb_40 ml_40 mr_40">
        <p class="info_text">아직 수선탐정 회원이 아니신가요?</p>
        <p class="link_text" @click="openJoinPopup">회원가입</p>
      </div>
    </div>
    <find-password-popup ref="passwordPopup" />
    <join-popup ref="joinPopup" />
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import FindPasswordPopup from './popup/FindPasswordPopup';
import JoinPopup from './popup/JoinPopup';
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
    };
  },
  methods: {
    login() {
      if (isEmpty(this.userEmail)) {
        this.$notify.warning({
          message: '이메일을 입력해주세요.',
          position: 'bottom-right',
          showClose: false,
          duration: 3000,
        });
        return;
      }
      if (isEmpty(this.password)) {
        this.$notify.warning({
          message: '비밀번호를 입력해주세요.',
          position: 'bottom-right',
          showClose: false,
          duration: 3000,
        });
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
            this.$notify.error({
              message: result.message,
              position: 'bottom-right',
              showClose: false,
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    openJoinPopup() {
      this.$refs.joinPopup.open();
    },
    openPasswordPopup() {
      this.$refs.passwordPopup.open();
    },
  },
};
</script>

<style lang="css">
@import '../../assets/css/login.css';
.login_container {
  background: linear-gradient(to left, rgb(218, 238, 252), rgb(225, 220, 253));
  height: 100vh;
  overflow: scroll;
  margin: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
