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
          <div class="d_flex align_center agree justify_start mb_16">
            <input class="mr_10 checkbox" type="checkbox" v-model="allCheck" />
            <p>필수 약관 전체동의</p>
          </div>
        </div>
        <div class="single_checked">
          <div class="d_flex agree justify_between">
            <div class="d_flex align_center">
              <input class="mr_10 checkbox" type="checkbox" v-model="essentialCheck[0]" />
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
              <input class="mr_10 checkbox" type="checkbox" v-model="essentialCheck[1]" />
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
              <input class="mr_10 checkbox" type="checkbox" v-model="selectiveCheck[0]" />
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
              <input class="mr_10 checkbox" type="checkbox" v-model="selectiveCheck[1]" />
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
      <!-- 이메일 입력 -->
      <validation-observer ref="emailForm">
        <form>
          <validation-provider class="input_box" rules="required|email" v-slot="{ errors }">
            <input type="text" class="mail" placeholder="name@email.com" v-model="formData.userEmail" />
            <p class="error_msg">{{ errors[0] }}</p>
          </validation-provider>
        </form>
      </validation-observer>
      <!-- 인증번호 입력 -->
      <validation-observer ref="authCodeForm">
        <form>
          <validation-provider class="input_box" v-if="numberSend === true" rules="required|isCoincideAuthCode" v-slot="{ errors }">
            <input type="text" placeholder="인증번호 입력" v-model="authCodeInput" />
            <p class="error_msg">{{ errors[0] }}</p>
          </validation-provider>
        </form>
      </validation-observer>
      <div class="tar">
        <!-- 인증번호 전송 클릭하면 인증번호 입력input, 재전송 버튼 나오고 인증번호 전송이 인증번호 확인 버튼으로 변경됨-->
        <button class="blue mr_8" @click="checkEmailValidate" v-if="numberSend === false">인증번호 전송</button>
        <button class="blue mr_8" v-if="numberSend === true" @click="checkAuthCode">인증번호 확인</button>
        <button class="blue" v-if="numberSend === true" @click="sendAuthMail">재전송</button>
      </div>
    </div>
    <!-- 회원 가입 폼 입력 -->
    <!-- 인증번호 확인 누르면 비밀번호 입력input, 닉네임 정하는 input 나옴 -->
    <validation-observer ref="userForm" v-if="joinPassword === true">
      <form>
        <div class="input_box">
          <input type="text" class="MAIL_GRAY check_ok" placeholder="name@email.com" v-model="formData.userEmail" disabled />
        </div>
        <validation-provider class="input_box" rules="required" v-slot="{ errors }">
          <input type="password" class="password" placeholder="비밀번호를 입력하세요" v-model="formData.password" />
          <p class="error_msg">{{ errors[0] }}</p>
        </validation-provider>
        <validation-provider class="input_box" rules="required|isCoincidePassword" v-slot="{ errors }">
          <input type="password" class="password" placeholder="비밀번호를 한번 더 입력하세요" v-model="formData.passwordRe" />
          <p class="error_msg">{{ errors[0] }}</p>
        </validation-provider>
        <validation-provider class="input_box mb-40" rules="required" v-slot="{ errors }">
          <input type="text" class="USER_ICON" placeholder="닉네임을 정해주세요." v-model="formData.username" />
          <p class="error_msg">{{ errors[0] }}</p>
        </validation-provider>
      </form>
      <button class="button_w100 blue color_w" @click="checkUserFormValidate">회원가입</button>
    </validation-observer>
  </div>
</template>

<script>
import { isNil } from 'lodash';
import { sendAuthMail } from '@/api/user';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

export default {
  name: 'JoinPopup',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    extend('required', {
      ...required,
      message: '필수 항목입니다.',
    });
    extend('email', {
      ...email,
      message: '올바른 형식이 아닙니다.',
    });
    extend('isCoincideAuthCode', {
      validate: (value) => {
        if (!isNil(this.authCode) && !isNil(value)) {
          return this.authCode.toString() === value.toString();
        }
        return false;
      },
      message: '인증번호가 일치하지 않습니다.',
    });
    extend('isCoincidePassword', {
      validate: (value) => {
        if (!isNil(this.formData.password) && !isNil(value)) {
          return this.formData.password === value;
        }
        return false;
      },
      message: '비밀번호가 일치하지 않습니다.',
    });
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
      authCode: '123',
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
     * 이메일 폼 유효성을 확인한다.
     */
    checkEmailValidate() {
      this.$refs.emailForm.validate().then((success) => {
        if (!success) {
          return;
        }
        this.sendAuthMail();
      });
    },
    /**
     * 인증번호를 확인한다.
     */
    checkAuthCode() {
      this.$refs.authCodeForm.validate().then((success) => {
        if (!success) {
          return;
        }
        this.joinPassword = true;
      });
    },
    /**
     * 회원 정보 폼 유효성을 확인한다.
     */
    checkUserFormValidate() {
      this.$refs.userForm.validate().then((success) => {
        if (!success) {
          return;
        }
        this.joinProc();
      });
    },
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
     * 회원가입을 진행한다.
     */
    joinProc() {
      this.$notify('회원가입이 완료되었습니다.');
    },
  },
};
</script>

<style lang="css"></style>
