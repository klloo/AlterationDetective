<template>
  <custom-popup ref="popup">
    <div slot="content">
      <!-- 뒤로가기 이미지 -->
      <div class="join_container tal">
        <div class="mb_16">
          <span class="BACKARR" @click="$emit('home')"></span>
        </div>
        <p class="title">
          Join
        </p>
        <!-- 약관동의 페이지 -->
        <div v-if="joindetail === 'none'">
          <div class="all_checked">
            <div class="d_flex align_center agree justify_start mb_16">
	  	    			<input
	  	    				class="mr_10 checkbox"
	  	    				type="checkbox"
	  	    			/>
              <p>필수 약관 전체동의</p>
            </div>
          </div>
          <div class="single_checked">
            <div class="d_flex agree justify_between">
              <div class="d_flex align_center">
	  	      	  <input
	  	      	  	class="mr_10 checkbox"
	  	      	  	type="checkbox"
	  	      	  	v-model="isAllChecked"
	  	      	  />
                <span class="essential">(필수)</span>
                <p>개인정보 수집 및 이용 동의</p>
              </div>
              <div class="d_flex align_center">
                <p class="fs_12 mr_8">보기</p>
                <span class="MORE"></span>
              </div>
	  	      </div>
            <div class="d_flex agree justify_between">
              <div class="d_flex align_center">
	  	      	  <input
	  	      	  	class="mr_10 checkbox"
	  	      	  	type="checkbox"
	  	      	  	v-model="isAllChecked"
	  	      	  />
                <span class="essential">(필수)</span>
                <p>서비스 이용약관 동의</p>
              </div>
              <div class="d_flex align_center">
                <p class="fs_12 mr_8">보기</p>
                <span class="MORE"></span>
              </div>
	  	      </div>
            <div class="d_flex agree justify_between">
              <div class="d_flex align_center">
	  	      	  <input
	  	      	  	class="mr_10 checkbox"
	  	      	  	type="checkbox"
	  	      	  	v-model="isAllChecked"
	  	      	  />
                <span class="essential">(선택)</span>
                <p>위치정보 이용약관</p>
              </div>
              <div class="d_flex align_center">
                <p class="fs_12 mr_8">보기</p>
                <span class="MORE"></span>
              </div>
	  	      </div>
            <div class="d_flex agree justify_between">
              <div class="d_flex align_center">
	  	      	  <input
	  	      	  	class="mr_10 checkbox"
	  	      	  	type="checkbox"
	  	      	  	v-model="isAllChecked"
	  	      	  />
                <span class="essential">(선택)</span>
                <p>마케팅 수신 동의</p>
              </div>
              <div class="d_flex align_center">
                <p class="fs_12 mr_8">보기</p>
                <span class="MORE"></span>
              </div>
	  	      </div>
          </div>
          <div>
            <p class="fs_14 mb_40">선택항목은 동의하지 않으셔도 서비스를 이용할 수 있어요.</p>
            <button class="button01 blue color_w" @click="joindetail = 'join'">
              다음
            </button>
          </div>
        </div>
      </div>
      <!-- 이메일 인증번호 전송 페이지 -->
      <div v-if="joindetail === 'join' && joinPassword === false">
        <p class="fw_700 tal fs_20 color_b mb_16">
          회원가입을 위해 <br>
          이메일 인증을 해주세요.
        </p>
        <div class="input_box">
          <input type="text" class="mail" placeholder="name@email.com" v-model="userId" />
        </div>
        <div class="input_box" v-if="numberSend === true">
          <input type="text" placeholder="인증번호 입력" />
        </div>
        <div class="tar">
          <!-- 인증번호 전송 클릭하면 인증번호 입력input, 재전송 버튼 나오고 인증번호 전송이 인증번호 확인 버튼으로 변경됨-->
          <button class="button02 mr_8" @click="numberSend = true" v-if="numberSend === false">인증번호 전송</button>
          <button class="button02 mr_8" v-if="numberSend === true" @click="joinPassword = true">인증번호 확인</button>
          <button class="button02" v-if="numberSend === true">재전송</button>
        </div>
      </div>
      <!-- 인증번호 확인 누르면 비밀번호 입력input, 닉네임 정하는 input 나옴 -->
      <div v-if="joinPassword === true">
        <div class="input_box">
          <input type="text" class="MAIL_GRAY check_ok" placeholder="name@email.com" v-model="userId" />
        </div>
        <div class="input_box" v-if="numberSend === true">
          <input type="text"
          class="password"
          placeholder="비밀번호를 입력하세요"
          />
        </div>
        <div class="input_box" v-if="numberSend === true">
          <input type="text" class="password" placeholder="비밀번호를 한번 더 입력하세요" />
        </div>
        <div class="input_box mb_40" v-if="numberSend === true">
          <input type="text" class="USER_ICON" placeholder="닉네임을 정해주세요." />
        </div>
        <!-- 회원가입 되면 main으로 이동해야함 -->
        <button class="button01 blue color_w">회원가입</button>
      </div>
    </div>
  </custom-popup>
</template>

<script>
import CustomPopup from '@/components/CustomPopup';
import { login } from '@/api/user';
import Common from '@/assets/css/common.css'
import ResetCss from '@/assets/css/reset.css'
import Login from '@/assets/css/Login.css'

export default {
  name: 'JoinPopup',
  emits: ['home'],
  components: {
    CustomPopup,
    Common,
    ResetCss,
    Login,
  },
  data() {
    return {
      userId: '',
      password: '',
      joindetail: 'none',
      numberSend: false,
      joinPassword : false,
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

<style lang="css">

</style>
