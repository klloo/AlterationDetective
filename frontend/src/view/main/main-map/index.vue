<template>
  <div>
    <!-- <alteraion-shop-detail-popup ref="detailPopup" :alteration-shop-id="selectedShopId" :latitude="latitude" :longitude="longitude" /> -->
    <search-popup ref="searchPopup" @select-addr="setPosition" @select-shop="selectAlterationShop" />
    <div>
      <div class="search_box pa_1">
        <div @click="openSearchPopup">
          <el-input class="search_bar" prefix-icon="el-icon-search" type="text" placeholder="지역명, 매장이름으로 검색하세요." readonly />
        </div>
        <div class="d_flex align_center">
          <el-tag :class="`my_tag mr_16 ${showDistanceTune ? 'selected' : ''}`" @click="showDistanceTune = !showDistanceTune">
            <i class="el-icon-s-operation mr_2 ml_2" />
          </el-tag>
          <div class="filter py_1">
            <!-- 필터 버튼 리스트 형식으로 변환하여 반복문으로 버튼 작성 (추후 확장 고려) -->
            <el-tag :class="`my_tag ml_3 mr_3 ${buttonClass(tag.tagId)}`" v-for="tag in tagList" :key="tag.tagId" @click="clickTag(tag.tagId)">
              &nbsp;{{ tag.tagName }}&nbsp;
            </el-tag>
          </div>
        </div>
        <!-- 거리 조정 슬라이더 -->
        <distance-tune v-show="showDistanceTune" @change-value="changeDistance"></distance-tune>
      </div>
      <!-- 지도 -->
      <div class="map_wrap" v-loading="isLoading" element-loading-background="rgba(255, 255, 255, 0.8)">
        <naver-maps :height="height" :width="width" :mapOptions="mapOptions" :initLayers="initLayers" @load="onLoad">
          <naver-marker :lat="latitude" :lng="longitude" />
          <naver-marker
            v-for="(item, index) in altreationShopList"
            :key="index"
            :lat="item.latitude"
            :lng="item.longitude"
            @click="selectAlterationShop(item)"
          ></naver-marker>
        </naver-maps>
        <el-button class="my-place" @click="setCurrentPosition" icon="el-icon-aim"> </el-button>
      </div>
      <!-- 수선집 목록 -->
      <modal-view-m>
        <div slot="open-title">
          <div class="tal">
            <p class="fs_24 mb_16">
              <span class="fw_600">{{ addressString }}</span>
              근처의
              <br />
              수선집을 추천하고 있어요!
            </p>
          </div>
        </div>
        <div slot="open">
          <recommend :alteration-shop-list="altreationShopList" @click-shop="selectAlterationShop"></recommend>
        </div>
        <div class="mt_8" slot="close">
          <span class="shop_count">
            <span style="font-weight: bold">
              {{ altreationShopList.length }}
            </span>
            개의 수선집 목록 보기
          </span>
        </div>
      </modal-view-m>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAlterationShopList, getTagList } from '@/api/alteration-shop';
import Recommend from './components/Recommend';
import DistanceTune from './components/DistanceTune';
import ModalViewM from '../../components/ModalSlideUp';
import AlteraionShopDetailPopup from './popup/AlteraionShopDetailPopup';
import SearchPopup from './popup/SearchPopup';

export default {
  name: 'MainMap',
  components: {
    AlteraionShopDetailPopup,
    ModalViewM,
    Recommend,
    DistanceTune,
    SearchPopup,
  },
  data() {
    // 기본 위치 (강남역)
    const latitude = 37.493168;
    const longitude = 127.030014;
    return {
      // 지도 관련 필드
      width: null,
      height: 300,
      map: null,
      latitude,
      longitude,
      mapOptions: {
        lat: latitude,
        lng: longitude,
        zoom: 15,
        zoomControl: false,
        mapTypeControl: false,
        mapDataControl: false,
        scaleControl: false,
      },
      initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN', 'TRANSIT', 'ENGLISH', 'CHINESE', 'JAPANESE'],
      // 상단 버튼 관련 필드
      selectedTagBtn: 0,
      tagList: [],
      // 수선집 목록
      altreationShopList: [],
      // 현재 클릭한 수선집 id
      selectedShopId: -1,
      // 로딩 중 여부
      isLoading: false,
      // 거리 조정 컴포넌트 제공 여부
      showDistanceTune: false,
      // 설정한 거리
      distance: 2,
      // 현위치 행정동 주소
      addressString: '',
      // 하단 추천 수선집 open 여부
      openShopList: false,
    };
  },
  methods: {
    /**
     * 지도가 로드되면 수행
     * map 컴포넌트 할당
     */
    onLoad(map) {
      this.map = map;
      // 태그 목록 조회
      this.loadTagList();
      // 현 위치 설정
      this.setCurrentPosition();
    },
    /**
     * 수선집 목록을 조회한다.
     */
    loadAlterationShopList() {
      const params = {
        longitude: this.longitude,
        latitude: this.latitude,
        distance: this.distance * 1000,
      };
      getAlterationShopList(params)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.altreationShopList = result.data;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 태그 목록을 조회한다.
     */
    loadTagList() {
      getTagList()
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.tagList = result.data;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 현재 위치를 가져온다.
     */
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
    /**
     * 현재 위치를 설정한다.
     *
     * @return  {[type]}  [return description]
     */
    setCurrentPosition() {
      this.isLoading = true;
      this.getCurrentPosition()
        .then((pos) => {
          // 마커 위치
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
          // 지도 위치
          this.setMapPosition();
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => {
          this.isLoading = false;
          // 좌표 -> 주소 변환
          this.coordsToAddres();
          // 수선집 목록 조회
          this.loadAlterationShopList();
        });
    },
    /**
     * 현재 설정된 위경도 정보로 지도 위치를 설정한다.
     */
    setMapPosition() {
      this.map.setCenter(new naver.maps.LatLng(this.latitude, this.longitude));
    },
    /**
     * 좌표를 주소로 변환한다.
     */
    coordsToAddres() {
      axios
        .get('/naver/map-reversegeocode/v2/gc', {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'n9dm36idtu',
            'X-NCP-APIGW-API-KEY': 'CqEzG5y5swiaYpXOX1Yo7dgdvMlAdlwAGjfwBwiq',
          },
          params: {
            coords: `${this.longitude},${this.latitude}`,
            // coords: '128.196087,37.1343799',
            // coords: '127.459223,36.6283933',
            // coords: '127.344345,36.3696542',
            output: 'json',
            orders: 'admcode',
          },
        })
        .then((res) => {
          const data = res.data;
          if (data.status.code === 0) {
            const region = res.data.results[0].region;
            this.addressString = `${region.area2.name} ${region.area3.name}`;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 버튼 클래스 반환
     */
    buttonClass(idx) {
      return this.selectedTagBtn === idx ? 'selected' : '';
    },
    /**
     * 수선집 선택한 경우 탭 변경
     */
    selectAlterationShop(item) {
      const param = {
        alterationShopId: item.alterationShopId,
        latitude: this.latitude,
        longitude: this.longitude,
      };
      this.$emit('change-tab', 'alterationShop', param);
    },
    /**
     * 설정한 거리 변경 핸들러
     */
    changeDistance(value) {
      this.map.setCenter(new naver.maps.LatLng(this.latitude, this.longitude));
      this.distance = value;
      this.mapOptions.zoom = 16 - Math.floor(this.distance * 0.5);
      this.map.setOptions(this.mapOptions);
      this.loadAlterationShopList();
    },
    /**
     * 파라미터로 전달받은 주소로 지도 위치를 설정한다.
     */
    setPosition(addr) {
      this.isLoading = true;
      axios
        .get('/naver/map-geocode/v2/geocode', {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'n9dm36idtu',
            'X-NCP-APIGW-API-KEY': 'CqEzG5y5swiaYpXOX1Yo7dgdvMlAdlwAGjfwBwiq',
          },
          params: {
            query: addr,
          },
        })
        .then((res) => {
          const data = res.data;
          if (data.status === 'OK') {
            const address = data.addresses[0];
            // 마커 위치
            this.latitude = Number(address.y);
            this.longitude = Number(address.x);
            // 지도 위치
            this.setMapPosition();
          }
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => {
          this.isLoading = false;
          // 좌표 -> 주소 변환
          this.coordsToAddres();
          // 수선집 목록 조회
          this.loadAlterationShopList();
        });
    },
    /**
     * 태그를 클릭한다.
     */
    clickTag(tagId) {
      if (this.selectedTagBtn == tagId) this.selectedTagBtn = 0;
      else this.selectedTagBtn = tagId;
    },
    /**
     * 검색 팝업을 연다.
     */
    openSearchPopup() {
      this.$refs.searchPopup.open();
    },
  },
};
</script>
<style scoped>
.search_bar {
  position: relative;
}
.search_bar {
  box-shadow: 0px 0px 7px rgb(0 0 0/ 20%);
}
.main .search_box {
  position: absolute;
  z-index: 999;
  width: 100%;
  padding: 1em;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgb(255, 255, 255, 0.1));
}
.main .TUNE {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: inline-block;
  margin-right: 8px;
}
.main .filter {
  overflow: auto;
  white-space: nowrap;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
  display: flex;
}
.main .filter::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.main .filter span,
.filter button {
  display: inline-block;
}
.main .filter button:last-child {
  margin-right: 0;
}
.main button {
  padding: 5px 12px;
  border-width: 0px;
  font-family: inherit;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  border-radius: 12px;
  border-style: none;
  cursor: pointer;
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  transition: 0.5s;
}
.map_wrap {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
}
.main .my-place {
  z-index: 999;
  position: absolute;
  bottom: 90px;
  right: 16px;
  background-color: #fff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  color: black;
  height: 38px;
  border-radius: 50px;
}
.my_tag {
  border-radius: 15px;
  color: rgb(87, 87, 87);
  background-color: white;
  border: none;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  height: 28px;
}
.selected {
  border: none;
  color: white;
  background: var(--maincolor) !important;
}
.shop_count {
  font-size: 15px;
}
</style>
