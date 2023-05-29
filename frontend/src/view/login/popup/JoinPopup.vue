<template>
  <popup ref="popup" :title="title" @closed="initInfo">
    <!-- 뒤로가기 이미지 -->
    <div slot="content" class="join_container">
      <div>
        <!-- 약관동의 페이지 -->
        <div v-if="joindetail === 'none'">
          <p class="fw_500 tal fs_20 color_b mb_16">서비스 이용약관을 <br />확인해 주세요.</p>
          <div class="all_checked">
            <label class="checkbox mb_16">
              <el-checkbox v-model="allCheck" />
              <p class="terms_text ml_8">필수 약관 전체동의</p>
            </label>
          </div>
          <div class="single_checked">
            <div>
              <div class="d_flex align_center">
                <label class="checkbox">
                  <el-checkbox v-model="essentialCheck[0]" />
                  <span class="essential ml_8 mr_4">(필수)</span>
                  <p class="terms_text">개인정보 수집 및 이용 동의</p>
                </label>
              </div>
              <div class="d_flex align_center">
                <p class="fs_12 mr_8">보기 &#62;</p>
              </div>
            </div>
            <div>
              <div class="d_flex align_center">
                <label class="checkbox">
                  <el-checkbox v-model="essentialCheck[1]" />
                  <span class="essential ml_8 mr_4">(필수)</span>
                  <p class="terms_text">서비스 이용약관 동의</p>
                </label>
              </div>
              <div class="d_flex align_center">
                <p class="fs_12 mr_8">보기 &#62;</p>
              </div>
            </div>
            <div>
              <div class="d_flex align_center">
                <label class="checkbox">
                  <el-checkbox v-model="selectiveCheck[0]" />
                  <span class="essential ml_8 mr_4">(선택)</span>
                  <p class="terms_text">위치정보 이용약관</p>
                </label>
              </div>
              <div class="d_flex align_center">
                <p class="fs_12 mr_8">보기 &#62;</p>
              </div>
            </div>
            <div>
              <div class="d_flex align_center">
                <label class="checkbox">
                  <el-checkbox v-model="selectiveCheck[1]" />
                  <span class="essential ml_8 mr_4">(선택)</span>
                  <p class="terms_text">마케팅 수신 동의</p>
                </label>
              </div>
              <div class="d_flex align_center">
                <p class="fs_12 mr_8">보기 &#62;</p>
              </div>
            </div>
          </div>
          <div>
            <p class="fs_14 mb_40">선택항목은 동의하지 않으셔도 서비스를 이용할 수 있어요.</p>
            <button class="button_w100 blue color_w" @click="clickNextBtn">
              다음
            </button>
          </div>
        </div>
      </div>
      <!-- 이메일 인증번호 전송 페이지 -->
      <div v-if="joindetail === 'join' && joinPassword === false">
        <p class="fw_500 tal fs_20 color_b mb_16">
          회원가입을 위해 <br />
          이메일 인증을 해주세요.
        </p>
        <el-form :model="formData" :disabled="numberSend" :rules="rules" ref="emailForm">
          <el-form-item prop="userEmail">
            <el-input prefix-icon="el-icon-message" placeholder="name@email.com" v-model="formData.userEmail"></el-input>
          </el-form-item>
        </el-form>
        <!-- 인증번호 입력 -->
        <el-form :model="formData" v-if="numberSend" :rules="rules" ref="authCodeForm">
          <el-form-item prop="authCodeInput">
            <el-input prefix-icon="el-icon-unlock" placeholder="인증번호 입력" v-model="formData.authCodeInput"></el-input>
          </el-form-item>
        </el-form>
        <div class="tar">
          <!-- 인증번호 전송 클릭하면 인증번호 입력input, 재전송 버튼 나오고 인증번호 전송이 인증번호 확인 버튼으로 변경됨-->
          <button class="button_w100 blue mr_8 mt_16" @click="checkEmailValidate" v-if="!numberSend">인증번호 전송</button>
          <button class="button_w100 blue mr_8 mt_16" v-if="numberSend" @click="checkAuthCode">인증번호 확인</button>
          <div v-if="numberSend" class="d_flex justify_between mb_8 mr_16 ml_16">
            <p class="info_text mt_40">인증번호가 도착하지 않으셨나요?</p>
            <p class="link_text mt_36" @click="sendAuthMail">인증번호 재전송</p>
          </div>
        </div>
      </div>
      <!-- 회원 가입 폼 입력 -->
      <!-- 인증번호 확인 누르면 비밀번호 입력input, 닉네임 정하는 input 나옴 -->
      <div v-if="joinPassword">
        <el-form :model="formData" :rules="rules" ref="userForm">
          <p class="fw_500 tal fs_20 color_b mb_16">회원가입을 위한 정보를<br />입력해 주세요.</p>
          <el-form-item prop="userEmail">
            <el-input prefix-icon="el-icon-message" placeholder="name@email.com" v-model="formData.userEmail" disabled></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-key" type="password" placeholder="비밀번호를 입력하세요" v-model="formData.password"></el-input>
          </el-form-item>
          <el-form-item prop="passwordRe">
            <el-input prefix-icon="el-icon-key" type="password" placeholder="비밀번호를 한번 더 입력하세요" v-model="formData.passwordRe"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" placeholder="닉네임을 입력해주세요" v-model="formData.username"></el-input>
          </el-form-item>
        </el-form>
        <button class="button_w100 mt_32 mb_40 blue color_w" @click="checkUserFormValidate">회원가입</button>
      </div>
    </div>
  </popup>
</template>

<script>
import Popup from '../components/popup';
import { isNil } from 'lodash';
import { sendAuthMail, registerUser } from '@/api/user';
import { validatePassword, validateUsername, validateDuplicatedEmail } from '@/utils/validation';

export default {
  name: 'JoinPopup',
  components: {
    Popup,
  },
  data() {
    return {
      formData: {
        userEmail: '',
        username: '',
        authCodeInput: '',
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
      authCode: '123',
      doneInput: false,
      title: '회원가입 (1/3)',
      rules: {
        userEmail: [
          { required: true, message: '필수 항목입니다.', trigger: 'blur' },
          { type: 'email', message: '올바른 형식이 아닙니다.', trigger: 'blur' },
          { validator: validateDuplicatedEmail, trigger: 'blur' },
        ],
        authCodeInput: [
          { required: true, message: '필수 항목입니다.', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let isSame = false;
              if (!isNil(this.authCode) && !isNil(value)) {
                isSame = this.authCode.toString() === value.toString();
              }
              if (!isSame) {
                callback(new Error('인증번호가 일치하지 않습니다.'));
              } else {
                callback();
              }
            },
          },
        ],
        password: [
          { required: true, message: '필수 항목입니다.', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' },
        ],
        passwordRe: [
          { required: true, message: '필수 항목입니다.', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!isNil(this.formData.password) && !isNil(value)) {
                if (this.formData.password != value) {
                  callback(new Error('비밀번호가 일치하지 않습니다.'));
                }
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        username: [
          { required: true, message: '필수 항목입니다.', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' },
        ],
      },
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
      this.$refs.emailForm.validate((valid) => {
        if (!valid) {
          return;
        }

        this.sendAuthMail();
        this.doneInput = true;
      });
    },
    /**
     * 인증번호를 확인한다.
     */
    checkAuthCode() {
      this.$refs.authCodeForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.title = '회원가입 (3/3)';
        this.joinPassword = true;
        this.$notify.success({
          message: '인증이 완료되었습니다.',
          position: 'bottom-right',
          showClose: false,
          duration: 3000,
        });
      });
    },
    /**
     * 회원 정보 폼 유효성을 확인한다.
     */
    checkUserFormValidate() {
      this.$refs.userForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.joinProc();
      });
    },
    /**
     * 인증메일을 전송한다.
     */
    sendAuthMail() {
      this.numberSend = true;
      // this.isLoading = true;
      // sendAuthMail({
      //   email: this.formData.userEmail,
      // })
      //   .then((data) => {
      //     const result = data.data;
      //     if (result.success) {
      //       this.authCode = result.data;
      //       if (this.authCode) {
      //         this.numberSend = true;
      //       }
      //       this.$notify.success({
      //         message: '인증번호를 전송하였습니다.',
      //         position: 'bottom-right',
      //         showClose: false,
      //         duration: 3000,
      //       });
      //     } else {
      //       this.$notify.error({
      //         message: '인증번호 전송에 실패하였습니다.',
      //         position: 'bottom-right',
      //         showClose: false,
      //         duration: 3000,
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     throw new Error(err);
      //   })
      //   .finally(() => (this.isLoading = false));
    },
    /**
     * 회원가입을 진행한다.
     */
    joinProc() {
      registerUser(this.formData)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.$notify.success({
              message: '회원가입이 완료되었습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
            this.$refs.popup.close();
          } else {
            this.$notify.error({
              message: '회원가입에 실패하였습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: '회원가입에 실패하였습니다.',
            position: 'bottom-right',
            showClose: false,
            duration: 3000,
          });
          throw new Error(err);
        });
    },
    /**
     * 팝업을 연다.
     */
    open() {
      this.$refs.popup.open();
    },
    /**
     * 약관 확인 다음 버튼을 클릭한다.
     */
    clickNextBtn() {
      if (!this.isAllCheckedEssential) {
        this.$notify.warning({
          message: '필수 약관에 동의해주세요.',
          position: 'bottom-right',
          showClose: false,
          duration: 3000,
        });
        return;
      }
      this.title = '회원가입 (2/3)';
      this.joindetail = 'join';
    },
    /**
     * 입력 정보를 초기화한다.
     */
    initInfo() {
      this.formData = {
        userEmail: '',
        username: '',
        password: '',
        passwordRe: '',
      };
      this.joindetail = 'none';
      this.numberSend = false;
      this.joinPassword = false;
      this.allCheck = false;
      this.essentialCheck = [false, false];
      this.selectiveCheck = [false, false];
      this.isLoading = false;
      this.authCodeInput = '';
      this.authCode = '123';
      this.doneInput = false;
      this.title = '회원가입 (1/3)';
    },
  },
};
</script>

<style lang="css">
.join_container {
  margin-top: 63px;
}
</style>
