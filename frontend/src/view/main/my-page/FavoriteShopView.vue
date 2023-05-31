<template>
  <popup ref="popup" title="좋아요한 수선집" titleIcon="el-icon-star-on">
    <div slot="content" class="mr_16 ml_16 mt_16">
      <div class="mt_100" v-if="isEmpty(alterationShopList) && !isLoading">좋아요한 수선집이 없어요 ㅜ_ㅜ</div>
      <el-row
        v-for="(shop, index) in alterationShopList"
        :key="index"
        class="mb_24"
        @click.native="$emit('select-shop', shop)"
        :gutter="10"
        type="flex"
        align="middle"
      >
        <el-col :span="5">
          <span class="RECOMMEND favorite-img"></span>
        </el-col>
        <el-col :span="19">
          <p class="mb_8 fw_700 tal title">
            {{ shop.alterationShopName }}
          </p>
          <div class="mb_8 d_flex align_center justify_between">
            <span class="address"> {{ shop.address }}</span>
          </div>
          <div class="d_flex justify_between">
            <div class="mb_8 mt_14 d_flex recommend_info">
              <span>{{ distFormatter(shop.dist) }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>리뷰</span>
              <span>&nbsp;{{ shop.reviewCount }}</span
              ><el-divider direction="vertical"></el-divider>
              <el-rate :value="starRateFormatter(shop.starRate)" show-score disabled />
            </div>
            <span :class="shop.likeFlag ? 'LIKE_BLUE' : 'LIKE_GRAY'" @click.stop="toggleLike(shop.alterationShopId)"></span>
          </div>
        </el-col>
      </el-row>
    </div>
  </popup>
</template>

<script>
import { find, isEmpty } from 'lodash';
import { toggleShopLike } from '@/api/alteration-shop';
import { getLikeShopList } from '@/api/alteration-shop';
import { distFormatter, starRateFormatter } from '@/utils/formatter';
import Popup from '../components/popup';

export default {
  name: 'FavoriteShopView',
  components: {
    Popup,
  },
  data() {
    return {
      alterationShopList: [],
      isLoading: false,
    };
  },
  computed: {
    curPos() {
      return this.$store.getters.curPos;
    },
  },
  methods: {
    isEmpty,
    distFormatter,
    starRateFormatter,
    /**
     * 좋아요 버튼을 클릭한다.
     */
    toggleLike(alterationShopId) {
      const targetShop = find(this.alterationShopList, (item) => {
        if (item.alterationShopId === alterationShopId) return item;
      });
      targetShop.likeFlag = !targetShop.likeFlag;

      toggleShopLike({ alterationShopId }).catch((err) => {
        throw new Error(err);
      });
    },
    /**
     * 좋아요한 수선집 목록을 조회한다.
     */
    loadData() {
      const params = {
        curLongitude: this.curPos.longitude,
        curLatitude: this.curPos.latitude,
      };
      this.isLoading = true;
      getLikeShopList(params)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.alterationShopList = result.data;
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
    open() {
      this.loadData();
      this.$refs.popup.open();
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="css">
.favorite-img {
  height: 80px !important;
}
.RECOMMEND {
  display: block;
  width: 100%;
  height: 136px;
  margin-bottom: 16px;
  border-radius: 8px;
}
</style>
