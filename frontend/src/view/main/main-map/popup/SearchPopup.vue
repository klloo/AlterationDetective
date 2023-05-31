<template>
  <popup ref="popup" @closed="initData">
    <div slot="content">
      <address-shop-search ref="search" @set-addr="setAddrList" @set-shop="setShopList" @change-keyword="changeKeyword" />
      <div class="search-bottom">
        <div v-show="!showResult">
          <div class="tal mt_8">
            <div class="d_flex justify_between">
              <span class="sub-title">최근 검색어</span>
              <span class="delete-all-button" @click="deleteAllKeyword">전체 삭제</span>
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
            <book-mark-place ref="bookmarkPlace" @select-addr="selectAddr" />
          </div>
        </div>
        <div v-show="showResult">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="주소" name="address">
              <addr-list-component :addrList="addrList" @select-addr="selectAddr"></addr-list-component>
            </el-tab-pane>
            <el-tab-pane label="매장" name="shop">
              <div v-show="isEmpty(shopList)" class="mt_32 d_flex justify_center">
                검색 결과가 없습니다.
              </div>
              <ul class="mt_8 tal scrollable">
                <li class="mb_8" v-for="(shop, index) in shopList" :key="index" @click="selectShop(shop)">
                  <el-row>
                    <!-- 가게 이름 -->
                    <div class="road-addr">{{ shop.alterationShopName }}</div>
                    <!-- 가게 주소 -->
                    <div class="jibun-addr">{{ shop.address }}</div>
                  </el-row>
                  <el-divider v-if="index != shopList.length - 1"></el-divider>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <add-bookmark-place-popup ref="addBookmarkPlacePopup" />
    </div>
  </popup>
</template>

<script>
import { isEmpty } from 'lodash';
import { getBookmarkPlace } from '@/api/user';
import Popup from '../../components/popup';
import AddBookmarkPlacePopup from './AddBookmarkPlacePopup';
import AddressShopSearch from '@/view/main/components/AddressShopSearch';
import AddrListComponent from '../components/AddrListComponent';
import BookMarkPlace from './BookMarkPlace';

export default {
  components: {
    Popup,
    AddressShopSearch,
    AddBookmarkPlacePopup,
    BookMarkPlace,
    AddrListComponent,
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
      this.$refs.bookmarkPlace.initData();
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
     * 편집 버튼을 클릭한다.
     */
    clickEditBtn() {
      this.$refs.addBookmarkPlacePopup.open();
    },
    /**
     * 팝업을 연다.
     */
    open() {
      this.$refs.popup.open();
      this.$nextTick(() => {
        this.$refs.bookmarkPlace.loadBookmarkPlace();
      });
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.$refs.popup.close();
    },
    /**
     * 검색 컴포넌트에서 키워드가 바뀔 때 호출되는 함수
     */
    changeKeyword(keyword) {
      this.showResult = !isEmpty(keyword);
      if (this.showResult) this.$refs.bookmarkPlace.initData();
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
.delete-all-button {
  height: 20px;
  width: 70px;
  font-size: 13px;
  border: 1px solid rgb(225, 225, 225);
  border-radius: 30px;
  text-align: center;
  padding-top: 3px;
  color: rgb(89, 89, 89);
}
</style>
