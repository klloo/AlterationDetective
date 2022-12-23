<template>
  <div class="search_box pa_1">
    <div class="input_box">
      <input type="text" placeholder="지역명, 매장이름으로 검색하세요." @input="procSearch" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAlterationShopList } from '@/api/alteration-shop';
import { isEmpty, debounce } from 'lodash';

export default {
  name: 'AddressSearch',
  props: {
    searchShop: {
      type: Boolean,
      default: true,
    },
    searchAddr: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    /**
     * 키워드로 검색한다.
     */
    procSearch: debounce(function(e) {
      const keyword = e.target.value;
      if (this.searchAddr) {
        this.procSearchAddr(keyword);
      }
      if (this.searchShop) {
        this.procSearchShop(keyword);
      }
    }, 250),
    /**
     * 주소를 검색한다.
     */
    procSearchAddr(keyword) {
      if (isEmpty(keyword)) {
        this.$emit('set-addr', []);
        return;
      }
      axios
        .get('/juso/addrlink/addrLinkApi.do', {
          params: {
            confmKey: 'U01TX0FVVEgyMDIyMTIyMjIxMTQwMTExMzM2Njk=',
            countPerPage: 5,
            keyword: keyword,
            resultType: 'json',
          },
        })
        .then((res) => {
          const data = res.data.results;
          if (data.common.errorCode === '0') {
            this.$emit('set-addr', data.juso);
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 수선집 목록을 조회한다.
     */
    procSearchShop(keyword) {
      if (isEmpty(keyword)) {
        this.$emit('set-shop', []);
        return;
      }
      const params = {
        keyword: keyword,
      };
      getAlterationShopList(params)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.$emit('set-shop', result.data);
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
.input_box {
  position: relative;
}
.input_box:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: url('~@/assets/images/Search.png') no-repeat;
  background-size: cover;
}
.input_box input {
  padding-left: 48px;
  box-shadow: 0px 0px 8px rgb(0 0 0 / 20%);
}
</style>
