<template>
  <div class="search_box pa_1">
    <div class="input_box">
      <el-input
        class="search_bar"
        prefix-icon="el-icon-search"
        placeholder="지역명, 매장이름으로 검색하세요."
        v-model="keyword"
        @input="procSearch"
        clearable
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAlterationShopList } from '@/api/alteration-shop';
import { isEmpty, debounce, cloneDeep } from 'lodash';

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
  data() {
    return {
      keyword: '',
    };
  },
  methods: {
    /**
     * 키워드로 검색한다.
     */
    procSearch: debounce(function(e) {
      if (this.searchAddr) {
        this.procSearchAddr();
      }
      if (this.searchShop) {
        this.procSearchShop();
      }
    }, 250),
    /**
     * 주소를 검색한다.
     */
    procSearchAddr() {
      if (isEmpty(this.keyword)) {
        this.$emit('set-addr', []);
        return;
      }
      axios
        .get('/juso/addrlink/addrLinkApi.do', {
          params: {
            confmKey: 'U01TX0FVVEgyMDIyMTIyMjIxMTQwMTExMzM2Njk=',
            countPerPage: 20,
            keyword: this.keyword,
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
    procSearchShop() {
      if (isEmpty(this.keyword)) {
        this.$emit('set-shop', []);
        return;
      }
      const params = {
        keyword: this.keyword,
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
    initData() {
      this.keyword = '';
    },
    getKeyword() {
      return this.keyword;
    },
    setKeyword(keyword) {
      this.keyword = keyword;
      if (this.searchAddr) {
        this.procSearchAddr();
      }
      if (this.searchShop) {
        this.procSearchShop();
      }
    },
  },
};
</script>

<style lang="css">
.search_bar {
  position: relative;
  box-shadow: 0px 0px 3px rgb(0 0 0/ 10%);
}
</style>
