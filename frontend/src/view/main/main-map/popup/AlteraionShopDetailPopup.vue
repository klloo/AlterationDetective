<template>
  <div>
    <div class="mb_32 d_flex align_center mb_32">
      <span class="BACKARR mr_16" @click="closePopup"></span>
      <span class="fw_400 fs_20">{{ shopInfo.alterationShopName }}</span>
    </div>
    <div>{{ shopInfo.address }}</div>
    <div>{{ shopInfo.phoneNumber }}</div>
    <div>{{ shopInfo.starRate }}</div>
    <div>
      <span v-for="tag in shopInfo.tagList" :key="tag.tagId"> #{{ tag.tagName }} </span>
    </div>
  </div>
</template>
<script>
import { getAlterationShopDetail } from '@/api/alteration-shop';

export default {
  name: 'AlterationShopDetailPopup',
  props: {
    alterationShopId: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      default: 127,
    },
    latitude: {
      type: Number,
      default: 37,
    },
  },
  data() {
    return {
      shopInfo: {},
      shopId: -1,
    };
  },
  watch: {
    alterationShopId: {
      handler(value) {
        if (value > 0) {
          this.shopId = value;
          this.loadData();
        }
      },
    },
  },
  methods: {
    /**
     * 수선집 상세 정보를 조회한다.
     */
    loadData() {
      const params = {
        longitude: this.longitude,
        latitude: this.latitude,
        alterationShopId: this.alterationShopId,
      };
      getAlterationShopDetail(params)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.shopInfo = result.data;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.shopInfo = {};
      this.shopId = -1;
      this.$emit('back');
    },
  },
};
</script>

<style lang="css">
.password_forgot {
  margin-top: 63px;
}
.side_title {
}
</style>
