<template>
  <popup ref="popup" title="검색" @closed="initData" type="search">
    <div slot="content">
      <address-shop-search ref="search" @set-addr="setAddrList" @set-shop="setShopList" />
      <div class="search-bottom">
        <div v-show="!showResult">
          <div class="tal mt_8">
            <div class="d_flex justify_between">
              <span class="sub-title">최근 검색어</span>
              <span class="underline-text" @click="deleteAllKeyword">전체 삭제</span>
            </div>
            <div v-show="isEmpty(recentKeywords)" class="mt_32 d_flex justify_center">
              최근 검색어가 없습니다.
            </div>
            <ul class="mt_8">
              <el-tag
                class="keyword-tag ml_4 mr_4 mt_8"
                v-for="(keyword, index) in recentKeywords"
                :key="index"
                @click="setKeyword(keyword)"
                closable
                @close="deleteKeyword(keyword)"
              >
                &nbsp;{{ keyword.keyword }}
              </el-tag>
            </ul>
          </div>
          <div class="mt_40">
            <div class="d_flex justify_between">
              <span class="sub-title">즐겨찾는 장소</span>
              <span class="underline-text">편집</span>
            </div>
            <el-card
              class="mt_12 box-card tal"
              shadow="none"
              v-for="place in bookmarkPlace"
              :key="place.placeId"
              @click.native="selectAddr(place.address)"
            >
              <el-row>
                <el-col :span="2">
                  <i :class="place.iconClass" style="color: var(--maincolor);" />
                </el-col>
                <el-col :span="20">
                  <p class="place-name">{{ place.placeName }}</p>
                  <p class="jibun-addr">{{ place.address }}</p>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </div>
        <div v-show="showResult">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="주소" name="address">
              <div v-show="isEmpty(addrList)" class="mt_32 d_flex justify_center">
                검색 결과가 없습니다.
              </div>
              <ul class="mt_8 tal scrollable">
                <li v-for="(addr, index) in addrList" :key="index" @click="selectAddr(addr.roadAddr)">
                  <el-row>
                    <el-col :span="2">
                      <i class="el-icon-location" style="color: var(--maincolor);" />
                    </el-col>
                    <!-- 도로명 주소 -->
                    <el-col :span="20">
                      <div class="road-addr">
                        {{ addr.roadAddr }}
                      </div>
                      <!-- 지번 주소 -->
                      <div class="jibun-addr">{{ addr.jibunAddr }}</div>
                    </el-col>
                  </el-row>
                  <el-divider></el-divider>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="매장" name="shop">
              <div v-show="isEmpty(shopList)" class="mt_32 d_flex justify_center">
                검색 결과가 없습니다.
              </div>
              <ul class="mt_8">
                <li class="mb_8" v-for="(shop, index) in shopList" :key="index" @click="selectShop(shop)">
                  <div>{{ shop.alterationShopName }}</div>
                  <div>{{ shop.address }}</div>
                  <hr />
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </popup>
</template>

<script>
import '@/assets/css/modal.m.css';
import { getBookmarkPlace } from '@/api/user';
import Popup from '../../../components/popup';
import { isEmpty } from 'lodash';
import AddressShopSearch from '@/view/main/components/AddressShopSearch';

export default {
  components: {
    Popup,
    AddressShopSearch,
  },
  name: 'SearchPopup',
  data() {
    return {
      addrList: [],
      shopList: [],
      bookmarkPlace: [],
      showResult: false,
      activeTab: 'address',
    };
  },
  computed: {
    keyword() {
      return this.$refs.search.getKeyword();
    },
    recentKeywords() {
      return this.$store.getters.recentKeywords;
    },
  },
  watch: {
    addrList() {
      this.showResult = !isEmpty(this.keyword);
    },
    shopList() {
      this.showResult = !isEmpty(this.keyword);
    },
  },
  methods: {
    isEmpty,
    /**
     *  주소를 선택한다.
     */
    selectAddr(addr) {
      if (!isEmpty(this.keyword)) {
        const keyword = {
          type: 'ADDR',
          keyword: this.keyword,
        };
        this.$store.dispatch('addRecentKeyword', keyword);
      }
      this.$emit('select-addr', addr);
      this.closePopup();
      this.initData();
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
      this.$emit('select-shop', shop);
      this.closePopup();
      this.initData();
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
    /**
     * 즐겨찾는 장소 정보를 조회한다.
     */
    loadBookmarkPlace() {
      getBookmarkPlace()
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.bookmarkPlace = result.data;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 팝업을 연다.
     */
    open() {
      this.$refs.popup.open();
      this.loadBookmarkPlace();
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

<style lang="css">
@import '../../../../assets/css/search.css';
.place-add-btn {
  height: inherit;
  width: 100%;
}
</style>
