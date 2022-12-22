<template>
  <div>
    <div class="mb_32 d_flex align_center mb_32">
      <span class="BACKARR mr_16" @click="closePopup"></span>
      <span class="fw_400 fs_20 popup_title"> 검색 </span>
    </div>
    <div class="search_box pa_1">
      <div class="input_box">
        <input type="text" placeholder="지역명, 매장이름으로 검색하세요." v-model="keyword" />
      </div>
    </div>
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

export default {
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
      this.$emit('select-addr', addr.roadAddr);
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
.password_forgot {
  margin-top: 63px;
}
.underline {
  text-decoration: underline;
  cursor: pointer;
}
</style>
