<template>
  <el-dialog
    custom-class="write-popup"
    title="리뷰 작성하기"
    :visible.sync="isOpen"
    :before-close="initData"
    width="90%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="false"
  >
    <p class="fw_700 tal shop-name">
      {{ shopInfo.alterationShopName }}
    </p>
    <div class="mt_8 d_flex align_center justify_between">
      <span class="address"> {{ shopInfo.address }}</span>
    </div>
    <el-divider></el-divider>
    <el-form :model="review" :rules="rules" ref="reviewForm">
      <el-form-item prop="starRate">
        <el-rate v-model="review.starRate" show-score allow-half />
      </el-form-item>
      <el-form-item prop="content">
        <el-input
          maxlength="300"
          show-word-limit
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 14 }"
          placeholder="리뷰 내용을 입력해주세요."
          v-model="review.content"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-row class="mt_32 mb_16" :gutter="15">
      <el-col :span="12">
        <button class="button_w100" @click="closePopup">취소</button>
      </el-col>
      <el-col :span="12">
        <button class="button_w100 blue color_w" @click="onClickSaveButton">작성</button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { cloneDeep } from 'lodash';
import { registerReview } from '@/api/review';

export default {
  name: 'WriteReviewPopup',
  data() {
    return {
      isOpen: false,
      review: {
        alterationShopId: -1,
        starRate: 5,
        content: '',
      },
      shopInfo: {},
      rules: {
        content: [{ required: true, message: '내용을 입력해주세요.', trigger: 'blur' }],
      },
    };
  },
  methods: {
    /**
     * 팝업을 연다.
     */
    open(alterationShopId, shopInfo) {
      this.review.alterationShopId = alterationShopId;
      this.shopInfo = cloneDeep(shopInfo);
      this.isOpen = true;
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.isOpen = false;
      this.$refs.reviewForm.clearValidate();
      this.initData();
    },
    /**
     * 데이터를 초기화한다.
     */
    initData() {
      this.review = {
        alterationShopId: -1,
        starRate: 5,
        content: '',
      };
    },
    /**
     * 저장 버튼을 클릭한다.
     */
    onClickSaveButton() {
      this.$refs.reviewForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.saveProc();
      });
    },
    /**
     * 작성한 리뷰를 저장한다.
     */
    saveProc() {
      registerReview({ review: this.review })
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.$notify.success({
              message: '리뷰가 작성되었습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
            this.$emit('load-review');
            this.closePopup();
          } else {
            this.$notify.error({
              message: '리뷰작성에 실패하였습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: '리뷰작성에 실패하였습니다.',
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
@import '../../../../assets/css/search.css';
.write-popup {
  border-radius: 7px;
}
.shop-name {
  margin-bottom: 3px;
  font-size: 18px;
}
</style>
