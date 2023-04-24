<template>
  <popup ref="popup" :title="shopInfo.alterationShopName" v-loading="isLoading">
    <div slot="content">
      <div>{{ shopInfo.address }}</div>
      <div>{{ shopInfo.phoneNumber }}</div>
      <div>{{ shopInfo.starRate }}</div>
      <div>
        <span v-for="tag in shopInfo.tagList" :key="tag.tagId"> #{{ tag.tagName }} </span>
      </div>
    </div>
  </popup>
</template>
<script>
import Popup from '../../../components/popup';
import { getAlterationShopDetail } from '@/api/alteration-shop';
// 이 컴포넌트 안쓸거면 지워야함
export default {
  name: 'AlterationShopDetailPopup',
  components: {
    Popup,
  },
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
      isLoading: false,
    };
  },
  watch: {
    alterationShopId: {
      handler(value) {
        if (value > 0) {
          this.shopId = value;
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
        longitude: this.longitude,
        latitude: this.latitude,
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
    open() {
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

<style lang="css"></style>
