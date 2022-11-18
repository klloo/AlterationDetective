<template>
  <div>
    <div v-show="mode === 'none'" class="login_container">
      <div class="mb_40">
        <span class="LOGIN_BACK"></span>
      </div>
      <div class="d_flex flex_column px_1">
        <button @click="mode = 'login'" class="button_w100 blue mb_16">로그인</button>
        <button @click="mode = 'join'" class="button_w100 skyblue mb_16">회원가입</button>
        <!-- figma디자인에 비밀번호 찾기 버튼은 로그인 클릭하고 난 뒤에 있음 -->
        <router-link to="../main/index.vue" class="link_text">로그인없이 둘러보기</router-link>
      </div>
    </div>
    <div v-if="mode === 'login'" class="px_1">
      <LoginPopup @home="mode = 'none'"></LoginPopup>
    </div>
    <div v-if="mode === 'join'" class="px_1">
      <JoinPopup @home="mode = 'none'"></JoinPopup>
    </div>
  </div>
</template>

<script>
import LoginPopup from './popup/LoginPopup';
import JoinPopup from './popup/JoinPopup';

export default {
  name: 'Login',
  components: {
    LoginPopup,
    JoinPopup,
  },
  data() {
    return {
      isOpen: false,
      currentComponent: null,
      mode: 'none',
    };
  },
};
</script>

<style lang="css">
.login_container {
  margin-top: 164px;
}
.LOGIN_BACK {
  background-image: url('~@/assets/images/LOGIN_BACK.png');
  background-size: cover;
  background-position: center;
  width: 375px;
  height: 375px;
  display: block;
}
.button_w100 {
  font-size: 16px;
}
</style>
