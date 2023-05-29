<template>
  <div>
    <el-row class="header">
      <el-col @click.native="clickHamBtn" :span="1">
        <i class="el-icon-s-unfold icon-btn mt_16 ml_8"></i>
      </el-col>
      <el-col :span="22">
        <p class="title mt_16" @click="clickTitle">
          수선탐정
          <i class="el-icon-map-location icon-btn"></i>
        </p>
      </el-col>
    </el-row>
    <my-page-slider ref="myPage" @open-popup="openPopup"></my-page-slider>
    <main-map-view ref="mainMap"></main-map-view>
    <my-info-popup ref="myInfo"></my-info-popup>
    <favorite-shop-popup ref="favorite" @select-shop="selectShop"></favorite-shop-popup>
    <review-popup ref="review" @select-shop="selectShop"></review-popup>
  </div>
</template>

<script>
import MainMapView from './main-map';
import MyPageSlider from './my-page';
import FavoriteShopPopup from './my-page/FavoriteShopView';
import ReviewPopup from './my-page/ReviewView';
import MyInfoPopup from './my-page/MyInfoView';

export default {
  name: 'MainView',
  components: {
    MainMapView,
    MyPageSlider,
    FavoriteShopPopup,
    ReviewPopup,
    MyInfoPopup,
  },
  data() {
    return {
      popupList: ['myInfo', 'favorite', 'review'],
    };
  },
  methods: {
    /**
     * 좌측 상단 햄버거 버튼을 클릭한다.
     */
    clickHamBtn() {
      this.$refs.myPage.open();
    },
    /**
     * 타이틀 클릭시 모든 팝업을 닫는다.
     */
    clickTitle() {
      this.$refs.mainMap.closePopups();
      this.closePopups();
    },
    /**
     * 팝업을 연다.
     */
    openPopup(popupName) {
      this.closePopups();
      this.$refs[popupName].open();
    },
    /**
     * 팝업들을 닫는다.
     */
    closePopups() {
      this.popupList.forEach((popup) => this.$refs[popup].closePopup());
    },
    /**
     * 수선집을 선택한다.
     */
    selectShop(shop) {
      this.closePopups();
      this.$refs.mainMap.selectAlterationShop(shop);
    },
  },
};
</script>

<style scoped>
.header {
  z-index: 1000;
  height: 50px;
  width: 100%;
  text-align: center;
  position: fixed;
  background: white;
}
.title {
  font-weight: 400;
  font-size: 20px;
}
.icon-btn {
  font-size: 20px;
}
</style>
