<template>
  <div>
    <div class="d_flex justify_between">
      <span class="sub-title">즐겨찾는 장소</span>
      <span @click="clickEditBtn">
        <div class="edit-button" v-if="!isEdit">편집</div>
        <div class="edit-done-button" v-else>편집 완료</div>
      </span>
    </div>
    <div v-if="isEmpty(originBookmarkPlaces) && !isEdit">
      <p class="mt_32 mb_16">
        즐겨찾는 장소가 없습니다.
      </p>
    </div>
    <p v-else-if="isEdit" class="mt_8 tal info-text">최대 {{ maxSize }}곳 까지 지정할 수 있습니다.</p>
    <el-card class="mt_12 box-card tal" shadow="none" v-for="place in bookmarkPlaces" :key="place.placeId" @click.native="selectAddr(place)">
      <el-row>
        <el-col :span="2">
          <i :class="place.iconClass" style="color: var(--maincolor);" />
        </el-col>
        <el-col :span="20">
          <p class="place-name">{{ place.placeName }}</p>
          <p class="jibun-addr">{{ place.address }}</p>
        </el-col>
        <el-col :span="2" v-if="isEdit">
          <el-button class="place-del-btn" @click="clickDelBtn(place.placeId, $event)">
            <i class="el-icon-close" />
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <div v-if="showAddbtn" class="mt_12">
      <el-button class="place-add-btn" @click="openAddPopup">
        <i class="el-icon-plus" />
      </el-button>
    </div>
    <add-bookmark-place-popup ref="addBookmarkPlacePopup" @save-place="savePlace" />
  </div>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash';
import { getBookmarkPlace, getBookmarkPlaceMaxId, updateBookmarkPlace } from '@/api/user';
import AddBookmarkPlacePopup from './AddBookmarkPlacePopup';

export default {
  components: {
    AddBookmarkPlacePopup,
  },
  name: 'BookmarkPlace',
  data() {
    return {
      originBookmarkPlaces: [],
      editBookmarkPlaces: [],
      isEdit: false,
      maxSize: 5,
      maxId: 0,
    };
  },
  computed: {
    showAddbtn() {
      return this.isEdit && this.editBookmarkPlaces.length < this.maxSize;
    },
    bookmarkPlaces() {
      return this.isEdit ? this.editBookmarkPlaces : this.originBookmarkPlaces;
    },
  },
  methods: {
    isEmpty,
    /**
     * 즐겨찾는 장소 정보를 조회한다.
     */
    loadBookmarkPlace(isEdit) {
      getBookmarkPlace()
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.originBookmarkPlaces = cloneDeep(result.data);
            this.editBookmarkPlaces = cloneDeep(result.data);
            this.loadMaxId();
            if (isEdit) this.isEdit = !this.isEdit;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 즐겨찾는 장소의 maxId 값을 조회한다.
     */
    loadMaxId() {
      getBookmarkPlaceMaxId()
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.maxId = result.data.maxId;
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
      if (this.isEdit) this.saveBookmarkPlaces();
      else {
        this.loadBookmarkPlace();
        this.isEdit = !this.isEdit;
      }
    },
    /**
     * 삭제 버튼을 클릭한다.
     */
    clickDelBtn(placeId, e) {
      e.stopPropagation();
      const idx = this.editBookmarkPlaces.findIndex((item) => item.placeId == placeId);
      this.editBookmarkPlaces.splice(idx, 1);
    },
    /**
     * 즐겨찾는 주소를 선택한다.
     */
    selectAddr(place) {
      if (this.isEdit) {
        this.$nextTick(() => {
          this.$refs.addBookmarkPlacePopup.open(place);
        });
      } else this.$emit('select-addr', place.address);
    },
    /**
     * 즐겨찾는 장소 추가 팝업을 연다.
     */
    openAddPopup() {
      this.$nextTick(() => {
        this.$refs.addBookmarkPlacePopup.open(null);
      });
    },
    /**
     * 즐겨찾는 장소를 수정 또는 추가한다.
     */
    savePlace(place) {
      // 추가
      if (place.placeId === -1) {
        place.placeId = ++this.maxId;
        this.editBookmarkPlaces.push(place);
      } else {
        // 수정
        const idx = this.editBookmarkPlaces.findIndex((item) => item.placeId === place.placeId);
        this.editBookmarkPlaces.splice(idx, 1, place);
      }
    },
    /**
     * 변경된 즐겨찾는 장소 정보를 저장한다.
     */
    saveBookmarkPlaces() {
      const params = {
        editList: this.editBookmarkPlaces.filter((item) =>
          this.originBookmarkPlaces.some((origin) => origin.placeId === item.placeId && item.isEdit),
        ),
        addList: this.editBookmarkPlaces.filter((item) => this.originBookmarkPlaces.every((origin) => origin.placeId !== item.placeId)),
        delList: this.originBookmarkPlaces.filter((item) => this.editBookmarkPlaces.every((origin) => origin.placeId !== item.placeId)),
      };
      if (isEmpty(params.editList) && isEmpty(params.addList) && isEmpty(params.delList)) {
        this.isEdit = !this.isEdit;
        return;
      }
      updateBookmarkPlace(params)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.loadBookmarkPlace(true);
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
      this.isEdit = false;
      this.editBookmarkPlaces = cloneDeep(this.originBookmarkPlaces);
    },
  },
};
</script>

<style lang="css">
@import '../../../../assets/css/search.css';
.place-add-btn {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  color: #303133;
}
.place-del-btn {
  width: 100%;
  height: 35px;
  border: none;
}
.info-text {
  color: rgb(98, 98, 98);
  font-size: 14px;
}
.edit-done-button {
  height: 20px;
  width: 70px;
  font-size: 13px;
  border: 1px solid rgb(225, 225, 225);
  border-radius: 30px;
  text-align: center;
  padding-top: 3px;
  color: rgb(89, 89, 89);
}
.edit-button {
  height: 20px;
  width: 50px;
  font-size: 13px;
  border: 1px solid rgb(225, 225, 225);
  border-radius: 30px;
  text-align: center;
  padding-top: 3px;
  color: rgb(89, 89, 89);
}
</style>
