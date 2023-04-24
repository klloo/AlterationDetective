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
        <el-form :model="formData" :rules="rules" ref="emailForm">
          <el-form-item prop="userEmail">
            <el-input prefix-icon="el-icon-message" placeholder="name@email.com" v-model="formData.userEmail"></el-input>
          </el-form-item>
        </el-form>
        <button class="button_w100 blue mt_16" @click="checkEmailValidate">비밀번호 재설정하기</button>
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
import Popup from '../../components/popup';
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
      },
      passwordReset: false,
      rules: {
        userEmail: [
          { required: true, message: '필수 항목입니다.', trigger: 'blur' },
          { type: 'email', message: '올바른 형식이 아닙니다.', trigger: 'blur' },
          { validator: validateExistEmail, trigger: 'blur' },
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
        this.passwordReset = true;
        // this.sendAuthMail();
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
      };
      this.passwordReset = false;
    },
  },
};
</script>

<style lang="css">
.password_forgot {
  margin-top: 63px;
}
</style>
