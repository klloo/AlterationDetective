<template>
  <div>
    <div class="mt_64" v-if="isEmpty(reviewList)">리뷰가 존재하지 않습니다.</div>
    <div v-for="(review, index) in reviewList" :key="index">
      <div class="mt_24 mr_16 ml_16">
        <!-- 사용자 리뷰 관리일 경우 -->
        <div v-if="!isEmpty(review.alterationShopName) && !isEmpty(review.address)">
          <div class="d_flex justify_between">
            <div @click="clickShopName(review)">
              <p class="fs_18 fw_700 tal title">
                {{ review.alterationShopName }}
              </p>
              <div class="mb_8 d_flex align_center">
                <span class="address"> {{ review.address }}</span>
              </div>
            </div>
            <div v-if="review.userEmail === loginUser.userEmail" class="delete-button" @click="clickDelBtn(review.reviewId)">삭제</div>
          </div>
          <div class="d_flex justify_between title_container mt_4">
            <el-rate :value="review.starRate" show-score disabled />
            <p class="fs_15" style="color: rgb(80, 80, 80);">{{ dateFormatter(review.createDatetime) }}</p>
          </div>
        </div>
        <!-- 수선집 상세의 리뷰일 경우 -->
        <el-row v-else>
          <el-col :span="3" class="mr_4">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
          </el-col>
          <el-col :span="20">
            <div class="d_flex justify_between title_container">
              <p class="fw_700 tal title">
                {{ review.username }}
              </p>
              <div v-if="review.userEmail === loginUser.userEmail" class="delete-button" @click="clickDelBtn(review.reviewId)">삭제</div>
            </div>
            <div class="d_flex justify_between title_container mt_4">
              <el-rate :value="review.starRate" show-score disabled />
              <p class="fs_15" style="color: rgb(80, 80, 80);">{{ dateFormatter(review.createDatetime) }}</p>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt_16 ml_4">
          <img v-if="!isEmpty(review.image)" :src="review.image" class="review-img" />
          <p class="tal mb_32">{{ review.content }}</p>
        </el-row>
      </div>
    </div>
    <el-dialog custom-class="confirm-popup" append-to-body :visible.sync="confirmVisible" width="80%">
      <div class="fs_15 fw_700" style="text-align: center;">삭제하시겠습니까?</div>
      <div slot="footer">
        <el-row class="mb_16" :gutter="20">
          <el-col :span="12">
            <button class="button_w100 confirm-button" @click="confirmVisible = false">취소</button>
          </el-col>
          <el-col :span="12">
            <button class="button_w100 blue color_w confirm-button" @click="deleteReviewProc">확인</button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { isEmpty } from 'lodash';
import { dateFormatter } from '@/utils/formatter';
import { deleteReview } from '@/api/review';

export default {
  name: 'ReviewList',
  props: {
    reviewList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      confirmVisible: false,
      delReviewId: -1,
    };
  },
  computed: {
    loginUser() {
      return this.$store.getters.userInfo;
    },
  },
  methods: {
    isEmpty,
    dateFormatter,
    /**
     * 리뷰를 삭제한다.
     */
    deleteReviewProc() {
      deleteReview({ reviewId: this.delReviewId })
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.$notify.success({
              message: '리뷰가 삭제되었습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
            this.$emit('load-review');
            this.confirmVisible = false;
          } else {
            this.$notify.error({
              message: '리뷰삭제에 실패하였습니다.',
              position: 'bottom-right',
              showClose: false,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: '리뷰삭제에 실패하였습니다.',
            position: 'bottom-right',
            showClose: false,
            duration: 3000,
          });
          throw new Error(err);
        });
    },
    /**
     * 삭제버튼을 클릭한다.
     */
    clickDelBtn(reviewId) {
      this.confirmVisible = true;
      this.delReviewId = reviewId;
    },
    /**
     * 가게 이름을 클릭한다.
     */
    clickShopName(review) {
      this.$emit('select-shop', review);
    },
  },
};
</script>

<style lang="css">
.review-img {
  display: block;
  width: 100%;
  margin-bottom: 16px;
}
.delete-button {
  height: 20px;
  width: 50px;
  font-size: 13px;
  border: 1px solid rgb(225, 225, 225);
  border-radius: 30px;
  text-align: center;
  padding-top: 3px;
  color: rgb(89, 89, 89);
}
.confirm-popup {
  border-radius: 7px;
}
.confirm-button {
  height: 40px !important;
}
</style>
