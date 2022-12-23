<template>
  <div>
    <div class="mb_32 d_flex align_center mb_32">
      <span class="BACKARR mr_16" @click="closePopup"></span>
      <span class="fw_400 fs_20 popup_title"> 검색 </span>
    </div>
    <address-shop-search ref="search" @set-addr="setAddrList" @set-shop="setShopList" />
    <div class="mt_32" v-show="!showResult">
      <div>
        <span>즐겨찾는 장소</span>
        <span class="underline">편집</span>
      </div>
      <div class="mt_32">
        <span>최근 검색어</span>
        <span class="underline" @click="deleteAllKeyword">전체 삭제</span>
        <ul class="mt_8">
          <li class="mb_8" v-for="(keyword, index) in recentKeywords" :key="index" @click="setKeyword(keyword)">
            <span>{{ keyword.keyword }}</span>
            <span @click.stop="deleteKeyword(keyword)"> x </span>
            <hr />
          </li>
        </ul>
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
      <ul class="mt_8">
        <li class="mb_8" v-for="(shop, index) in shopList" :key="index" @click="selectShop(shop)">
          <div>{{ shop.alterationShopName }}</div>
          <div>{{ shop.address }}</div>
          <hr />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import AddressShopSearch from '@/view/main/components/AddressShopSearch';

export default {
  components: { AddressShopSearch },
  name: 'SearchPopup',
  data() {
    return {
      addrList: [],
      shopList: [],
    };
  },
  computed: {
    showResult() {
      return !isEmpty(this.addrList) || !isEmpty(this.shopList);
    },
    keyword() {
      return this.$refs.search.getKeyword();
    },
    recentKeywords() {
      return this.$store.getters.recentKeywords;
    },
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
     *  주소를 선택한다.
     */
    selectAddr(addr) {
      const keyword = {
        type: 'ADDR',
        keyword: this.keyword,
      };
      this.$store.dispatch('addRecentKeyword', keyword);
      this.initData();
      this.$emit('select-addr', addr.roadAddr);
    },
    /**
     *  수선집을 선택한다.
     */
    selectShop(shop) {
      const keyword = {
        type: 'SHOP',
        keyword: this.keyword,
      };
      this.$store.dispatch('addRecentKeyword', keyword);
      this.initData();
      this.$emit('select-shop', shop);
    },
    /**
     * 데이터를 초기화한다.
     */
    initData() {
      this.$refs.search.initData();
      this.addrList = [];
      this.shopList = [];
    },
    /**
     * 주소 목록을 설정한다.
     */
    setAddrList(addrList) {
      this.addrList = addrList;
    },
    /**
     * 수선집 목록을 설정한다.
     */
    setShopList(shopList) {
      this.shopList = shopList;
    },
    /**
     * 키워드를 설정한다.
     */
    setKeyword(keyword) {
      this.$refs.search.setKeyword(keyword.keyword);
    },
    /**
     * 최근 검색 키워드를 삭제 한다.
     */
    deleteKeyword(keyword) {
      this.$store.dispatch('deleteRecentKeyword', keyword);
    },
    /**
     * 최근 검색 키워드를 모두 삭제한다.
     */
    deleteAllKeyword() {
      this.$store.dispatch('deleteAllRecentKeyword');
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
