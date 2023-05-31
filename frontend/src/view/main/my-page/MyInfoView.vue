<template>
  <popup ref="popup" @closed="initForm" title="내 정보" titleIcon="el-icon-user-solid">
    <div slot="content" class="mr_16 ml_16 mt_16">
      <div v-if="isEdit">
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
        <el-row class="mt_40 mb_40" :gutter="15">
          <el-col :span="12">
            <button class="button_w100" @click="isEdit = false">취소</button>
          </el-col>
          <el-col :span="12">
            <button class="button_w100 blue color_w" @click="checkUserFormValidate">수정 완료</button>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-form>
          <el-form-item prop="username" label="닉네임">
            <el-input prefix-icon="el-icon-user" placeholder="닉네임을 입력해주세요" v-model="formData.username" disabled></el-input>
          </el-form-item>
          <el-form-item prop="userEmail" label="이메일">
            <el-input prefix-icon="el-icon-message" v-model="formData.userEmail" disabled></el-input>
          </el-form-item>
        </el-form>
        <button class="button_w100 mt_32 mb_16 blue color_w" @click="clickEditBtn">수정하기</button>
        <button class="button_w100" @click="clickDeleteBtn">회원 탈퇴</button>
      </div>
      <el-dialog custom-class="confirm-popup" append-to-body :visible.sync="confirmVisible" width="80%">
        <div class="fs_15 fw_700" style="text-align: center;">
          <div class="mb_24" style="white-space: pre-line;">{{ dialogContent }}</div>
          <el-input prefix-icon="el-icon-key" type="password" placeholder="비밀번호를 입력하세요" v-model="checkPassword"></el-input>
        </div>
        <div slot="footer">
          <el-row class="mb_16" :gutter="20">
            <el-col :span="12">
              <button class="button_w100 confirm-button" @click="confirmVisible = false">취소</button>
            </el-col>
            <el-col :span="12">
              <button class="button_w100 blue color_w confirm-button" @click="passwordCheck">확인</button>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
  </popup>
</template>

<script>
import { isNil } from 'lodash';
import { validatePassword, validateUsername } from '@/utils/validation';
import { updateUser, deleteUser, checkPassword } from '@/api/user';
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
      checkPassword: '',
      isEdit: false,
      confirmVisible: false,
      confirmMode: '',
      dialogContent: '',
      rules: {
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
      this.isEdit = false;
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
            this.isEdit = false;
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
      this.confirmVisible = false;
      this.$refs.popup.open();
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.initForm();
      this.$refs.popup.close();
    },
    /**
     * 수정하기 버튼을 클릭한다.
     */
    clickEditBtn() {
      this.dialogContent = '비밀번호를 입력해주세요.';
      this.confirmMode = 'edit';
      this.checkPassword = '';
      this.confirmVisible = true;
    },
    /**
     * 회원 탈퇴 버튼을 클릭한다.
     */
    clickDeleteBtn() {
      this.dialogContent = '정말 탈퇴하시겠습니까?\n탈퇴하시려면 비밀번호를 입력해주세요.';
      this.confirmMode = 'delete';
      this.checkPassword = '';
      this.confirmVisible = true;
    },
    /**
     * 수정 폼을 초기화하고 수정 모드로 전환한다.
     */
    setEditMode() {
      this.initForm();
      this.isEdit = true;
    },
    /**
     * 비밀번호를 확인한다.
     */
    passwordCheck() {
      checkPassword({ password: this.checkPassword })
        .then((data) => {
          const result = data.data;
          if (result.success) {
            const isSame = result.data;
            console.log(isSame);
            if (isSame) {
              if (this.confirmMode === 'edit') this.setEditMode();
              else this.deleteUser();
              this.confirmVisible = false;
            } else {
              this.$notify.error({
                message: '비밀번호가 틀렸습니다.',
                position: 'bottom-right',
                showClose: false,
                duration: 3000,
              });
            }
          } else {
            this.$notify.error({
              message: '회원 정보 조회에 실패하였습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: '회원 정보 조회에 실패하였습니다.',
            position: 'bottom-right',
            showClose: false,
            duration: 3000,
          });
          throw new Error(err);
        });
    },
    /**
     * 회원을 탈퇴처리 한다.
     */
    deleteUser() {
      deleteUser()
        .then((data) => {
          const result = data.data;
          if (result.success) {
            // 탈퇴 후 로그인화면으로 이동한다..
            this.$store.dispatch('setUserInfo', {});
            this.$router.go(this.$router.currentRoute);
            this.$notify.success({
              message: '회원 탈퇴가 처리되었습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          } else {
            this.$notify.error({
              message: '회원 탈퇴에 실패하였습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: '회원 탈퇴에 실패하였습니다.',
            position: 'bottom-right',
            showClose: false,
            duration: 3000,
          });
          throw new Error(err);
        });
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
.confirm-popup {
  border-radius: 7px;
}
.confirm-button {
  height: 40px !important;
}
</style>
