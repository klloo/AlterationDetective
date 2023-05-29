<template>
  <popup ref="popup" v-loading="isLoading">
    <div slot="content">
      <div class="mr_16 ml_16 mt_32 tal">
        <span class="RECOMMEND"></span>
        <div class="d_flex justify_between title_container">
          <p class="fw_700 tal title fs_24">
            {{ shopInfo.alterationShopName }}
          </p>
          <span :class="shopInfo.likeFlag ? 'LIKE_BLUE' : 'LIKE_GRAY'" @click.stop="toggleLike()"></span>
        </div>
        <el-rate :value="starRateFormatter(shopInfo.starRate)" show-score disabled />
        <el-row class="d_flex mt_12">
          <el-col :span="6" class="fw_600">주소</el-col>
          <el-col :span="18">
            <span class="address"> {{ shopInfo.address }}</span>
            <span style="color: gray;">&nbsp;({{ distFormatter(shopInfo.dist) }})</span>
          </el-col>
        </el-row>
        <el-row class="d_flex mt_12">
          <el-col :span="6" class="fw_600">전화번호</el-col>
          <el-col :span="18">
            <span class="address">
              <i class="el-icon-phone" />
              {{ shopInfo.phoneNumber }}
            </span>
          </el-col>
        </el-row>
      </div>
      <div class="my-divider" />
      <el-row class="ml_16" type="flex" justify="space-between" align="bottom">
        <el-col :span="8" class="d_flex justify_start">
          <span class="fw_700 fs_18"> 리뷰 </span>
          <span class="fs_18 ml_4" style="color: gray;">({{ reviewList.length }})</span>
        </el-col>
        <el-col @click.native="clickWriteButton" class="write-button" :span="6"><i class="el-icon-edit" /> 작성하기</el-col>
      </el-row>
      <review-list :review-list="reviewList" @load-review="loadReviewData"></review-list>
      <write-review-popup ref="writeReview" @load-review="loadReviewData" />
    </div>
  </popup>
</template>
<script>
import Popup from '../../components/popup';
import { getAlterationShopDetail } from '@/api/alteration-shop';
import { getAlterationShopReviewList } from '@/api/review';
import { toggleShopLike } from '@/api/alteration-shop';
import { distFormatter, starRateFormatter } from '@/utils/formatter';
import ReviewList from '../../components/ReviewList';
import WriteReviewPopup from './WriteReviewPopup';

export default {
  name: 'AlterationShopDetailPopup',
  components: {
    Popup,
    ReviewList,
    WriteReviewPopup,
  },
  data() {
    return {
      shopInfo: {},
      alterationShopId: -1,
      isLoading: false,
      reviewList: [],
    };
  },
  computed: {
    curPos() {
      return this.$store.getters.curPos;
    },
  },
  watch: {
    alterationShopId: {
      handler(value) {
        if (value > 0) {
          this.shopInfo = {};
          this.reviewList = [];
          this.loadData();
        }
      },
    },
  },
  methods: {
    distFormatter,
    starRateFormatter,
    /**
     * 데이터를 로드한다.
     */
    loadData() {
      this.loadShopData();
      this.loadReviewData();
    },
    /**
     * 수선집 리뷰 정보를 로드한다.
     */
    loadReviewData() {
      getAlterationShopReviewList({ alterationShopId: this.alterationShopId })
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
     * 수선집 상세 정보를 조회한다.
     */
    loadShopData() {
      const params = {
        longitude: this.curPos.longitude,
        latitude: this.curPos.latitude,
        alterationShopId: this.alterationShopId,
      };
      this.isLoading = true;
      getAlterationShopDetail(params)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.shopInfo = result.data;
          }
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    /**
     * 팝업을 연다.
     */
    open(params) {
      this.alterationShopId = params.alterationShopId;
      this.latitude = params.latitude;
      this.longitude = params.longitude;
      this.$refs.popup.open();
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.$refs.popup.close();
    },
    /**
     * 좋아요 버튼을 클릭한다.
     */
    toggleLike() {
      this.shopInfo.likeFlag = !this.shopInfo.likeFlag;
      toggleShopLike({ alterationShopId: this.alterationShopId }).catch((err) => {
        throw new Error(err);
      });
    },
    /**
     * 작성하기 버튼을 클릭한다.
     */
    clickWriteButton() {
      this.$nextTick(() => {
        this.$refs.writeReview.open(this.alterationShopId, this.shopInfo);
      });
    },
  },
};
</script>

<style lang="css">
.RECOMMEND {
  display: block;
  width: 100%;
  height: 180px;
  margin-bottom: 16px;
}
.LIKE_GRAY,
.LIKE_BLUE {
  display: inline-block;
  width: 20px;
  height: 20px;
}
.title_container {
  align-items: end;
}
.my-divider {
  height: 13px;
  width: 100%;
  margin-top: 25px;
  margin-bottom: 20px;
  background-color: rgb(243, 243, 243);
}
.write-button {
  height: 20px;
  font-size: 14px;
  text-align: center;
  padding-top: 3px;
  color: rgb(89, 89, 89);
}
</style>
