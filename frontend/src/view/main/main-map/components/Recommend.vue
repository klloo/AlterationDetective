<template>
  <div>
    <div class="mt_100" v-if="isEmpty(alterationShopList)">추천 수선집이 없어요 ㅜ_ㅜ</div>
    <div v-for="(shop, index) in alterationShopList" :key="index" class="mb_16" @click="$emit('click-shop', shop)">
      <el-card>
        <span class="RECOMMEND"></span>
        <p class="fw_700 tal title">
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
            <el-rate :value="shop.starRate" show-score disabled />
          </div>
          <span :class="shop.likeFlag ? 'LIKE_BLUE' : 'LIKE_GRAY'" @click.stop="toggleLike(shop.alterationShopId)"></span>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { find, isEmpty } from 'lodash';
import { toggleShopLike } from '@/api/alteration-shop';
import { distFormatter } from '@/utils/formatter';

export default {
  name: 'Recommend',
  props: {
    address: {
      type: String,
      default: '',
    },
    alterationShopList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    isEmpty,
    distFormatter,
    toggleLike(alterationShopId) {
      const targetShop = find(this.alterationShopList, (item) => {
        if (item.alterationShopId === alterationShopId) return item;
      });
      targetShop.likeFlag = !targetShop.likeFlag;

      toggleShopLike({ alterationShopId }).catch((err) => {
        throw new Error(err);
      });
    },
  },
};
</script>

<style lang="css">
.RECOMMEND {
  display: block;
  width: 100%;
  height: 136px;
  margin-bottom: 16px;
  border-radius: 8px;
}
.STAR {
  display: inline-block;
  width: 14px;
  height: 14px;
}
.LIKE_GRAY,
.LIKE_BLUE {
  display: inline-block;
  width: 20px;
  height: 20px;
}
.title {
  margin-bottom: 3px;
  font-size: 18px;
}
.recommend_info {
  width: auto;
  margin-right: 8px;
  margin-top: 2px;
  font-size: 15px;
}
.specialty {
  font-size: 12px;
  font-weight: 400;
  color: #72757a;
}
.list_item {
  border-bottom: 1px solid #dde3e7;
}
.address {
  color: #6a6d75;
  font-size: 15px;
}
</style>
