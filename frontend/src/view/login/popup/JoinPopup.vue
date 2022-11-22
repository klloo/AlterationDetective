<template>
  <div>
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
          <label class="checkbox mb_16">
            <input type="checkbox" v-model="allCheck"/>
            <span class="checkbox_icon mr_8"></span>
            <p>필수 약관 전체동의</p>
          </label>
        </div>
        <div class="single_checked">
          <div>
            <div class="d_flex align_center">
            <label class="checkbox">
              <input type="checkbox" v-model="essentialCheck[0]"/>
              <span class="checkbox_icon mr_8"></span>
              <span class="essential">(필수)</span>
              <p>개인정보 수집 및 이용 동의</p>
            </label>
            </div>
            <div class="d_flex align_center">
            <p class="fs_12 mr_8">보기</p>
            <span class="MORE"></span>
            </div>
          </div>
          <div>
            <div class="d_flex align_center">
            <label class="checkbox">
              <input type="checkbox" v-model="essentialCheck[1]" />
              <span class="checkbox_icon mr_8"></span>
              <span class="essential">(필수)</span>
              <p>서비스 이용약관 동의</p>
            </label>
            </div>
            <div class="d_flex align_center">
            <p class="fs_12 mr_8">보기</p>
            <span class="MORE"></span>
            </div>
          </div>
          <div>
            <div class="d_flex align_center">
            <label class="checkbox">
              <input type="checkbox" v-model="selectiveCheck[0]"/>
              <span class="checkbox_icon mr_8"></span>
              <span class="essential">(선택)</span>
              <p>위치정보 이용약관</p>
            </label>
            </div>
            <div class="d_flex align_center">
            <p class="fs_12 mr_8">보기</p>
            <span class="MORE"></span>
            </div>
          </div>
          <div>
            <div class="d_flex align_center">
            <label class="checkbox">
              <input type="checkbox" v-model="selectiveCheck[1]"/>
              <span class="checkbox_icon mr_8"></span>
              <span class="essential">(선택)</span>
              <p>마케팅 수신 동의</p>
            </label>
            </div>
            <div class="d_flex align_center">
            <p class="fs_12 mr_8">보기</p>
            <span class="MORE"></span>
            </div>
          </div>
        </div>
        <div>
          <p class="fs_14 mb_40">선택항목은 동의하지 않으셔도 서비스를 이용할 수 있어요.</p>
          <button class="button_w100 blue color_w" @click="joindetail = 'join'" :disabled="!isAllCheckedEssential">
            다음
          </button>
        </div>
      </div>
    </div>
    <!-- 이메일 인증번호 전송 페이지 -->
    <div v-if="joindetail === 'join' && joinPassword === false">
      <p class="fw_700 tal fs_20 color_b mb_16">
        회원가입을 위해 <br />
        이메일 인증을 해주세요.
      </p>
      <div class="input_box">
        <input type="text" class="mail" placeholder="name@email.com" v-model="formData.userEmail" />
      </div>
      <div class="input_box" v-if="numberSend === true">
        <input type="text" placeholder="인증번호 입력" v-model="authCodeInput" />
      </div>
      <div class="tar">
        <!-- 인증번호 전송 클릭하면 인증번호 입력input, 재전송 버튼 나오고 인증번호 전송이 인증번호 확인 버튼으로 변경됨-->
        <button class="blue mr_8" @click="sendAuthMail" v-if="numberSend === false">인증번호 전송</button>
        <button class="blue mr_8" v-if="numberSend === true" @click="isCoincideAuthCode">인증번호 확인</button>
        <button class="blue" v-if="numberSend === true" @click="sendAuthMail">재전송</button>
      </div>
    </div>
    <!-- 인증번호 확인 누르면 비밀번호 입력input, 닉네임 정하는 input 나옴 -->
    <div v-if="joinPassword === true">
      <div class="input_box">
        <input type="text" class="MAIL_GRAY check_ok" placeholder="name@email.com" v-model="formData.userEmail" />
      </div>
      <div class="input_box" v-if="numberSend === true">
        <input type="password" class="password" placeholder="비밀번호를 입력하세요" v-model="formData.password" />
      </div>
      <div class="input_box" v-if="numberSend === true">
        <input type="password" class="password" placeholder="비밀번호를 한번 더 입력하세요" v-model="formData.passwordRe" />
      </div>
      <div class="input_box mb_40" v-if="numberSend === true">
        <input type="text" class="USER_ICON" placeholder="닉네임을 정해주세요." />
      </div>
      <!-- 회원가입 되면 main으로 이동해야함 -->
      <button class="button_w100 blue color_w" @click="joinProc">회원가입</button>
    </div>
  </div>
</template>

<script>
import { sendAuthMail } from '@/api/user';

export default {
  name: 'JoinPopup',
  emits: ['home'],
  data() {
    return {
      formData: {
        userEmail: '',
        username: '',
        password: '',
        passwordRe: '',
      },
      joindetail: 'none',
      numberSend: false,
      joinPassword: false,
      allCheck: false,
      essentialCheck: [false, false],
      selectiveCheck: [false, false],
      isLoading: false,
      authCodeInput: '',
      authCode: '',
    };
  },
  computed: {
    /**
     * 필수 약관이 모두 선택되었는지 확인한다 (true: 모두 선택됨)
     */
    isAllCheckedEssential() {
      if (this.allCheck) return true;
      return !this.essentialCheck.some((item) => !item);
    },
  },
  watch: {
    allCheck(value) {
      this.essentialCheck.fill(value);
    },
  },
  methods: {
    /**
     * 인증메일을 전송한다.
     */
    sendAuthMail() {
      this.isLoading = true;
      sendAuthMail({
        email: this.formData.userEmail,
      })
        .then((res) => {
          this.authCode = res.data;
          if (this.authCode) {
            this.numberSend = true;
          }
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => (this.isLoading = false));
    },
    /**
     * 인증번호가 일치하는지 확인한다.
     */
    isCoincideAuthCode() {
      if (this.authCode.toString() === this.authCodeInput) {
        this.joinPassword = true;
      } else {
        console.log('일치하지 않음');
      }
    },
    /**
     * 회원가입을 진행한다.
     */
    joinProc() {
      console.log(this.formData);
    },
  },
};
</script>

<style lang="css">
.join_container {
  margin-top: 63px;
}
</style>
