<template>
  <div>
    <div class="mb_32 d_flex align_center mb_32">
      <span class="BACKARR mr_16" @click="closePopup"></span>
      <span class="fw_400 fs_20 popup_title"> 검색 </span>
    </div>
    <address-search ref="search" @set-result="setAddrList" />
    <div class="mt_32" v-show="!showResult">
      <div>
        <span>즐겨찾는 장소</span>
        <span class="underline">편집</span>
      </div>
      <div class="mt_32">
        <span>최근 검색어</span>
        <span class="underline">전체 삭제</span>
      </div>
    </div>
    <div class="mt_32" v-show="showResult">
      <div>검색 결과</div>
      <div class="mt_16">주소</div>
      <ul class="mt_8">
        <li class="mb_8" v-for="(addr, index) in addrList" :key="index" @click="selectAddr(addr)">
          <!-- 도로명 주소 -->
          <div>{{ addr.roadAddr }}</div>
          <!-- 지번 주소 -->
          <div>{{ addr.jibunAddr }}</div>
          <hr />
        </li>
      </ul>
      <div class="mt_32">매장</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { isEmpty, debounce } from 'lodash';
import AddressSearch from '@/view/main/components/AddressSearch';

export default {
  components: { AddressSearch },
  name: 'SearchPopup',
  data() {
    return {
      keyword: '',
      showResult: false,
      addrList: [],
    };
  },
  watch: {
    addrList() {
      this.showResult = !isEmpty(this.addrList);
    },
    keyword: debounce(function() {
      this.searchAddr();
    }, 250),
  },
  methods: {
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.initData();
      this.$emit('back');
    },
    /**
     * 주소를 검색한다.
     */
    searchAddr() {
      if (isEmpty(this.keyword)) {
        this.addrList = [];
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
            this.addrList = data.juso;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     *  주소를 선택한다.
     */
    selectAddr(addr) {
      this.initData();
      this.$emit('select-addr', addr.roadAddr);
    },
    /**
     * 데이터를 초기화한다.
     */
    initData() {
      this.$refs.search.initData();
      this.addrList = [];
    },
    /**
     * 주소 목록을 설정한다.
     */
    setAddrList(addrList) {
      this.addrList = addrList;
    },
  },
};
</script>

<style lang="css">
.underline {
  text-decoration: underline;
  cursor: pointer;
}
</style>
