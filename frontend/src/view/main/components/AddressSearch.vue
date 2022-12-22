<template>
  <div class="search_box pa_1">
    <div class="input_box">
      <input type="text" placeholder="지역명, 매장이름으로 검색하세요." v-model="keyword" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { isEmpty, debounce } from 'lodash';

export default {
  name: 'AddressSearch',
  data() {
    return {
      keyword: '',
    };
  },
  watch: {
    keyword: debounce(function() {
      this.searchAddr();
    }, 250),
  },
  methods: {
    /**
     * 주소를 검색한다.
     */
    searchAddr() {
      if (isEmpty(this.keyword)) {
        this.$emit('get-result', []);
        return;
      }
      axios
        .get('/juso/addrlink/addrLinkApi.do', {
          params: {
            confmKey: 'U01TX0FVVEgyMDIyMTIyMjIxMTQwMTExMzM2Njk=',
            countPerPage: 5,
            keyword: this.keyword,
            resultType: 'json',
          },
        })
        .then((res) => {
          const data = res.data.results;
          if (data.common.errorCode === '0') {
            this.$emit('set-result', data.juso);
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 데이터를 초기화한다.
     */
    initData() {
      this.keyword = '';
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
