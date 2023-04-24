<template>
  <div>
    <div class="mb_32 d_flex align_center mb_32">
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
import { isNil } from 'lodash';
import { getAlterationShopDetail } from '@/api/alteration-shop';

export default {
  name: 'AlterationShopDetailPopup',
  props: {
    param: {
      type: Object,
      default: () => ({
        alterationShopId: -1,
        longitude: 127,
        latitude: 37,
      }),
    },
  },
  data() {
    return {
      shopInfo: {},
      shopId: -1,
    };
  },
  watch: {
    param: {
      deep: true,
      handler(value) {
        if (value.alterationShopId > 0) {
          this.shopId = value.alterationShopId;
          this.shopInfo = {};
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
        longitude: this.param.longitude,
        latitude: this.param.latitude,
        alterationShopId: this.param.alterationShopId,
      };
      if (isNil(params.alterationShopId) || params.alterationShopId < 0) return;
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
