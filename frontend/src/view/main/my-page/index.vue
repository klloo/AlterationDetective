<template>
  <el-drawer :visible.sync="visible" size="60%" direction="ltr" :with-header="false">
    <!-- 닫기 버튼 -->
    <div class="mt_24 mr_16 close-icon" @click="close">
      <i class="el-icon-close"></i>
    </div>
    <el-row class="ml_12">
      <el-col :span="6">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
      </el-col>
      <el-col :span="18">
        <div class="user-name mt_8 d_flex">
          <span style="font-weight: bold;">{{ loginUser.username }}</span>
          <span>&nbsp;님</span>
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <ul class="mt_8 tal scrollable">
      <li v-for="(menu, idx) in menuList" :key="idx" class="menu-list" @click="openPopup(menu.popupName)">
        <i :class="menu.iconClass"></i>
        {{ menu.title }}
      </li>
    </ul>
  </el-drawer>
</template>

<script>
import { logout } from '@/api/user';

export default {
  name: 'MyPageView',
  data() {
    return {
      /**
       * 팝업 display 여부
       */
      visible: false,
      /**
       * 메뉴 목록
       */
      menuList: [
        {
          title: '내 정보',
          popupName: 'myInfo',
          iconClass: 'el-icon-user-solid',
        },
        {
          title: '좋아요한 수선집',
          popupName: 'favorite',
          iconClass: 'el-icon-star-on',
        },
        {
          title: '리뷰 관리',
          popupName: 'review',
          iconClass: 'el-icon-edit-outline',
        },
        {
          title: '로그아웃',
          popupName: 'logout',
          iconClass: 'el-icon-switch-button',
        },
      ],
    };
  },
  computed: {
    loginUser() {
      return this.$store.getters.userInfo;
    },
  },
  methods: {
    /**
     * 로그아웃을 한다.
     */
    logout() {
      logout().then((data) => {
        if (data.data.success) {
          this.$store.dispatch('setUserInfo', {});
          this.$router.go(this.$router.currentRoute);
        }
      });
    },
    /**
     * 팝업 열기
     */
    open() {
      this.visible = true;
    },
    /**
     * 팝업 닫기
     */
    close() {
      this.visible = false;
    },
    /**
     * 선택한 화면으로 설정한다.
     */
    openPopup(popupName) {
      this.close();
      if (popupName === 'logout') {
        this.logout();
        return;
      }
      this.$emit('open-popup', popupName);
    },
  },
};
</script>

<style lang="css">
.user-name {
  font-size: 20px;
}
.close-icon {
  display: flex;
  justify-content: end;
  font-size: 20px;
}
.menu-list {
  margin-left: 18px;
  margin-bottom: 20px;
  font-size: 18px;
}
</style>
