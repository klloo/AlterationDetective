<template>
  <popup ref="popup" :title="`작성한 리뷰 (${reviewList.length})`" titleIcon="el-icon-edit-outline">
    <div slot="content">
      <review-list :review-list="reviewList" @load-review="loadReviewData" @select-shop="selectShop"></review-list>
    </div>
  </popup>
</template>

<script>
import Popup from '../components/popup';
import { getAlterationShopUserReviewList } from '@/api/review';
import ReviewList from '../components/ReviewList';

export default {
  name: 'ReviewView',
  components: {
    Popup,
    ReviewList,
  },
  data() {
    return {
      reviewList: [],
    };
  },
  computed: {
    loginUser() {
      return this.$store.getters.userInfo;
    },
  },
  methods: {
    /**
     * 팝업을 연다.
     */
    open() {
      this.loadReviewData();
      this.$refs.popup.open();
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.$refs.popup.close();
    },
    /**
     * 수선집 리뷰 정보를 로드한다.
     */
    loadReviewData() {
      getAlterationShopUserReviewList({ userEmail: this.loginUser.userEmail })
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.reviewList = result.data;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 수선집을 선택한다.
     */
    selectShop(review) {
      this.$emit('select-shop', review);
    },
  },
};
</script>

<style lang="css"></style>
