<template>
  <div class="password_forgot">
    <div class="mb_32 d_flex align_center mb_32">
      <span class="BACKARR mr_16" @click="$emit('home')"></span>
      <span class="fw_400 fs_20">비밀번호 재설정</span>
    </div>

    <div v-if="passwordReset === false">
      <p class="fs_20 title">
        가입했던 이메일을 입력해 주세요
        <br />
        비밀번호 재설정 메일을 보내드립니다.
      </p>
      <!-- 이메일 입력 -->
      <validation-observer ref="emailForm" class="input_box mb_40">
        <form>
          <validation-provider class="input_box" rules="required|email" v-slot="{ errors }">
            <input type="text" class="mail" placeholder="name@email.com" v-model="formData.userEmail" />
            <p class="error_msg">{{ errors[0] }}</p>
          </validation-provider>
        </form>
      </validation-observer>
      <button class="button_w100 blue" @click="checkEmailValidate">비밀번호 재설정하기</button>
    </div>
    <div v-if="passwordReset === true">
      <p class="fs_20 title">
        새로운 비밀번호를 입력해 주세요.
      </p>
      <validation-observer ref="passwordForm" class="input_box mb_40">
        <form>
          <validation-provider class="input_box" rules="required|validatePassword" v-slot="{ errors }">
            <input type="password" class="password" placeholder="새로운 비밀번호를 입력하세요" v-model="formData.password" />
            <p class="error_msg">{{ errors[0] }}</p>
          </validation-provider>
          <validation-provider class="input_box" rules="required|isCoincidePassword" v-slot="{ errors }">
            <input type="password" class="password" placeholder="비밀번호를 한번 더 입력하세요" v-model="formData.passwordRe" />
            <p class="error_msg">{{ errors[0] }}</p>
          </validation-provider>
        </form>
      </validation-observer>
      <button class="button_w100 blue" @click="checkPasswordFormValidate">비밀번호 재설정하기</button>
    </div>
  </div>
</template>
<script>
import { isNil } from 'lodash';
import { updateUser, checkDuplicatedEmail } from '@/api/user';
import { requiredRule, emailRule, validatePassword } from '@/utils/validation';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';

export default {
  name: 'FindPassword',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    extend('required', requiredRule);
    extend('email', emailRule);
    extend('validatePassword', validatePassword);
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
        password: '',
        passwordRe: '',
      },
      passwordReset: false,
    };
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
        // 이메일 중복 여부를 확인한다.
        checkDuplicatedEmail({
          email: this.formData.userEmail,
        })
          .then((data) => {
            const result = data.data;
            if (result.success) {
              if (!result.data) {
                this.$toast.error('가입되지 않은 이메일입니다.');
                return;
              } else {
                this.passwordReset = true;
                // this.sendAuthMail();
              }
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      });
    },
    /**
     * 비밀번호 재설정 폼 유효성을 확인한다.
     */
    checkPasswordFormValidate() {
      this.$refs.passwordForm.validate().then((success) => {
        if (!success) {
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
            this.$toast.success('비밀번호가 재설정 되었습니다.');
            this.$emit('home');
          } else {
            this.$toast.error('비밀번호를 재설정에 실패하였습니다.');
          }
        })
        .catch((err) => {
          this.$toast.error('비밀번호를 재설정에 실패하였습니다.');
          throw new Error(err);
        });
    },
  },
};
</script>

<style lang="css">
.password_forgot {
  margin-top: 63px;
}
.side_title {
}
</style>
