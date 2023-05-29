<template>
  <el-dialog
    custom-class="add-popup"
    title="즐겨찾는 장소"
    :visible.sync="isOpen"
    :before-close="initData"
    width="90%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-form :model="place" :rules="rules" ref="placeForm">
      <el-form-item prop="iconClass">
        <el-radio-group v-model="place.iconClass">
          <el-radio-button class="radio-button" v-for="className in iconClasses" :key="className" :label="className">
            <i :class="className" />
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="placeName">
        <el-input :prefix-icon="place.iconClass" placeholder="장소 이름" v-model="place.placeName"></el-input>
      </el-form-item>
      <el-form-item prop="address">
        <address-shop-search v-model="place.address" class="shop-search" ref="search" :searchShop="false" @set-addr="setAddrList" />
        <el-popover popper-class="search-result" placement="bottm" v-model="showAddrList">
          <addr-list-component :addrList="addrList" @select-addr="selectAddr"></addr-list-component>
        </el-popover>
      </el-form-item>
    </el-form>
    <el-row class="mt_32 mb_16" :gutter="15">
      <el-col :span="12">
        <button class="button_w100" @click="closePopup">취소</button>
      </el-col>
      <el-col :span="12">
        <button class="button_w100 blue color_w" @click="onClickSaveButton">저장</button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash';
import AddressShopSearch from '@/view/main/components/AddressShopSearch';
import AddrListComponent from '../components/AddrListComponent';

export default {
  components: {
    AddressShopSearch,
    AddrListComponent,
  },
  name: 'AddBookmarkPlacePopup',
  data() {
    return {
      isOpen: false,
      place: {
        placeId: -1,
        placeName: null,
        iconClass: 'el-icon-s-home',
        address: null,
        isEdit: false,
      },
      iconClasses: ['el-icon-s-home', 'el-icon-office-building', 'el-icon-s-shop', 'el-icon-star-on'],
      showAddrList: false,
      addrList: [],
      selectedAddr: false, // 검색 후 주소 선택했는지 여부
      rules: {
        placeName: [{ required: true, message: '장소 이름을 입력해주세요.', trigger: 'blur' }],
        address: [{ required: true, message: '주소를 입력해주세요.', trigger: 'blur' }],
      },
    };
  },
  methods: {
    /**
     * 팝업을 연다.
     */
    open(place) {
      if (!isEmpty(place)) {
        this.place = cloneDeep(place);
        this.place.isEdit = true;
        this.$nextTick(() => {
          this.$refs.search.setKeyword(this.place.address);
          this.selectedAddr = true;
        });
      }
      this.isOpen = true;
    },
    /**
     * 팝업을 닫는다.
     */
    closePopup() {
      this.isOpen = false;
      this.$refs.placeForm.clearValidate();
      this.initData();
    },
    /**
     * 데이터를 초기화한다.
     */
    initData() {
      this.$refs.search.initData();
      this.place = {
        placeId: -1,
        placeName: null,
        iconClass: 'el-icon-s-home',
        address: null,
        isEdit: false,
      };
    },
    /**
     * 검색된 주소 목록을 설정한다.
     */
    setAddrList(addrList) {
      this.addrList = addrList;
      this.showAddrList = true;
      if (isEmpty(this.$refs.search.getKeyword()) || this.selectedAddr) this.showAddrList = false;
      this.selectedAddr = false;
    },
    /**
     * 검색한 주소를 선택한다.
     */
    selectAddr(addr) {
      this.place.address = addr;
      this.$refs.search.setKeyword(addr);
      this.selectedAddr = true;
    },
    /**
     * 저장 버튼을 클릭한다.
     */
    onClickSaveButton() {
      this.$refs.placeForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.saveBookmark();
      });
    },
    /**
     * 작성한 즐겨찾기 내용을 저장한다.
     */
    saveBookmark() {
      this.$emit('save-place', this.place);
      this.isOpen = false;
      this.initData();
    },
  },
};
</script>

<style lang="css">
@import '../../../../assets/css/search.css';
.add-popup {
  border-radius: 7px;
}
.shop-search {
  padding: 0 !important;
}
.search-result {
  width: 100%;
  height: 370px;
  overflow: auto;
  padding: 15px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.search-result::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}
</style>
