<template>
  <popup ref="popup" @closed="initForm" title="내 정보" titleIcon="el-icon-user-solid">
    <div slot="content" class="mr_16 ml_16 mt_16">
      <el-form :model="formData" :rules="rules" ref="userForm">
        <el-form-item prop="username" label="닉네임">
          <el-input prefix-icon="el-icon-user" placeholder="닉네임을 입력해주세요" v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item prop="userEmail" label="이메일">
          <el-input prefix-icon="el-icon-message" v-model="formData.userEmail" disabled></el-input>
        </el-form-item>
        <el-form-item prop="password" label="비밀번호">
          <el-input prefix-icon="el-icon-key" type="password" placeholder="비밀번호를 입력하세요" v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item prop="passwordRe" label="비밀번호 재입력">
          <el-input prefix-icon="el-icon-key" type="password" placeholder="비밀번호를 한번 더 입력하세요" v-model="formData.passwordRe"></el-input>
        </el-form-item>
      </el-form>
      <button class="button_w100 mt_32 mb_40 blue color_w" @click="checkUserFormValidate">수정 완료</button>
    </div>
  </popup>
</template>

<script>
import { isNil } from 'lodash';
import { validatePassword, validateUsername } from '@/utils/validation';
import { updateUser } from '@/api/user';
import Popup from '../components/popup';

export default {
  name: 'MyInfoView',
  components: {
    Popup,
  },
  data() {
    return {
      formData: {
        username: '',
        userEmail: '',
        password: '',
        passwordRe: '',
      },
      isEdit: false,
      rules: {
        password: [
          { required: true, message: '필수 항목입니다.', trigger: 'blur' },
          // { validator: validatePassword, trigger: 'blur' },
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
    loginUser() {
      return this.$store.getters.userInfo;
    },
  },
  methods: {
    /**
     * 내 정보 수정 폼을 초기화한다.
     */
    initForm() {
      this.formData.username = this.loginUser.username;
      this.formData.userEmail = this.loginUser.userEmail;
      this.formData.password = '';
      this.formData.passwordRe = '';
    },
    /**
     * 회원 정보 폼 유효성을 확인한다.
     */
    checkUserFormValidate() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.editProc();
        }
      });
    },
    /**
     * 회원정보를 수정한다.
     */
    editProc() {
      updateUser(this.formData)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            const userInfo = result.data;
            this.$store.dispatch('setUserInfo', userInfo);
            this.$notify.success({
              message: '회원 정보가 수정되었습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          } else {
            this.$notify.error({
              message: '회원 정보 수정에 실패하였습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: '회원 정보 수정에 실패하였습니다.',
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
      this.initForm();
      this.$refs.popup.open();
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.initForm();
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="css">
.myinfo-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit-text {
  text-decoration: underline;
  cursor: pointer;
  color: rgb(98, 98, 98);
}
</style>
