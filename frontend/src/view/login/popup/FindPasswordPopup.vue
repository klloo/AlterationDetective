<template>
  <popup ref="popup" title="비밀번호 재설정" @closed="initInfo">
    <div slot="content">
      <div v-if="!passwordReset">
        <p class="fw_500 tal fs_20 color_b mb_16">
          <br />
          이메일 인증 후
          <br />
          비밀번호 재설정이 가능합니다.
        </p>
        <!-- 이메일 입력 -->
        <el-form :model="formData" :rules="rules" ref="emailForm" :disabled="numberSend">
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
      <div v-if="passwordReset">
        <p class="fw_500 tal fs_20 color_b mb_16">새로운 비밀번호를 <br />입력해 주세요.</p>
        <el-form :model="formData" :rules="rules" ref="passwordForm">
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-key" type="password" placeholder="비밀번호를 입력하세요" v-model="formData.password"></el-input>
          </el-form-item>
          <el-form-item prop="passwordRe">
            <el-input prefix-icon="el-icon-key" type="password" placeholder="비밀번호를 한번 더 입력하세요" v-model="formData.passwordRe"></el-input>
          </el-form-item>
        </el-form>
        <button class="button_w100 mt_16 blue" @click="checkPasswordFormValidate">비밀번호 재설정하기</button>
      </div>
    </div>
  </popup>
</template>
<script>
import Popup from '../components/popup';
import { isNil } from 'lodash';
import { updateUser } from '@/api/user';
import { validatePassword, validateExistEmail } from '@/utils/validation';

export default {
  name: 'FindPassword',
  components: {
    Popup,
  },
  data() {
    return {
      formData: {
        userEmail: '',
        password: '',
        passwordRe: '',
        authCodeInput: '',
      },
      numberSend: false,
      authCode: '123',
      passwordReset: false,
      rules: {
        userEmail: [
          { required: true, message: '필수 항목입니다.', trigger: 'blur' },
          { type: 'email', message: '올바른 형식이 아닙니다.', trigger: 'blur' },
          { validator: validateExistEmail, trigger: 'blur' },
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
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
    };
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
     * 인증번호를 확인한다.
     */
    checkAuthCode() {
      this.$refs.authCodeForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.passwordReset = true;
        this.$notify.success({
          message: '인증이 완료되었습니다.',
          position: 'bottom-right',
          showClose: false,
          duration: 3000,
        });
      });
    },
    /**
     * 비밀번호 재설정 폼 유효성을 확인한다.
     */
    checkPasswordFormValidate() {
      this.$refs.passwordForm.validate((valid) => {
        console.log(valid);
        if (!valid) {
          return;
        }
        this.resetPassword();
      });
    },
    /**
     * 비밀번호를 재설정한다.
     */
    resetPassword() {
      updateUser(this.formData)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.$notify.success({
              message: '비밀번호가 재설정 되었습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
            this.$refs.popup.close();
          } else {
            this.$notify.error({
              message: '비밀번호 재설정에 실패하였습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: '비밀번호 재설정에 실패하였습니다.',
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
     * 입력 정보를 초기화한다.
     */
    initInfo() {
      this.formData = {
        userEmail: '',
        password: '',
        passwordRe: '',
        authCodeInput: '',
      };
      this.passwordReset = false;
      this.numberSend = false;
      this.authCode = '123';
    },
  },
};
</script>

<style lang="css">
.password_forgot {
  margin-top: 63px;
}
</style>
