<template>
  <div>
    <div v-show="mode === 'none'" class="login_join_container">
      <div class="mb_40">
        <span class="LOGIN_BACK"></span>
      </div>
      <div class="d_flex flex_column px_1">
        <button @click="mode = 'login'" class="button_w100 blue mb_16">로그인</button>
        <button @click="mode = 'join'" class="button_w100 skyblue mb_16">회원가입</button>
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
.login_join_container {
  margin-top: 164px;
}
.LOGIN_BACK {
  background-image: url('~@/assets/images/LOGIN_BACK.png');
  background-size: cover;
  background-position: center;
  min-width: 375px;
  width: 100%;
  min-height: 375px;
  height: 412px;
  display: block;
}
.button_w100 {
  font-size: 16px;
}
</style>
