<template>
  <ul class="tal">
    <li class="list_item">
      <p class="fs_24 mb_16">
        <span class="fw_600">{{ address }}</span>
        근처의
        <br />
        수선집을 추천하고 있어요!
      </p>
      <p class="mb_8">추천 수선집</p>
      <div v-if="isEmpty(alterationShopList)">추천 수선집이 없어요</div>
      <div v-for="(shop, index) in alterationShopList" :key="index" class="mb_32" @click="$emit('click-shop', shop)">
        <span class="RECOMMEND"></span>
        <p class="mb_8 fw_600">
          {{ shop.alterationShopName }}
          <span class="specialty">교복</span>
        </p>
        <div class="mb_8 d_flex">
          <div class="recommend_info">
            <span class="STAR"></span>
            <span class="star_score"> {{ shop.starRate }}</span>
          </div>
          <div class="recommend_info">
            <span>리뷰</span>
            <span> {{ shop.reviewCount }}</span>
          </div>
          <div class="recommend_info">
            <span>{{ distFormatter(shop.dist) }}</span>
          </div>
        </div>
        <div class="mb_8 d_flex align_center justify_between">
          <span class="address"> {{ shop.address }}</span>
          <span :class="shop.likeFlag ? 'LIKE_BLUE' : 'LIKE_GRAY'" @click.stop="toggleLike(shop.alterationShopId)"></span>
        </div>
      </div>
    </li>
  </ul>
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
  width: 343px;
  height: 136px;
  margin-bottom: 8px;
}
.STAR {
  display: inline-block;
  width: 14px;
  height: 14px;
}
.LIKE_GRAY,
.LIKE_BLUE {
  display: inline-block;
  width: 24px;
  height: 24px;
}
.recommend_info {
  width: auto;
  margin-right: 4px;
}
.recommend_info:last-child {
  margin: 0;
}
.recommend_info:nth-child(even) {
  border-left: 1px solid #acb4bc;
  border-right: 1px solid #acb4bc;
  padding: 0 4px;
}
.specialty {
  font-size: 12px;
  font-weight: 400;
  color: #72757a;
}
.list_item {
  border-bottom: 1px solid #dde3e7;
}
</style>
