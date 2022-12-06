<template>
  <div>
    <div class="mb_32 d_flex align_center mb_32">
      <span class="BACKARR mr_16" @click="$emit('back')"></span>
      <span class="fw_400 fs_20">{{ shopInfo.alterationShopName }}</span>
    </div>
    <div>{{ shopInfo.address }}</div>
    <div>{{ shopInfo.phoneNumber }}</div>
  </div>
</template>
<script>
export default {
  name: 'AlterationShopDetailPopup',
  props: {
    shopInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="css">
.password_forgot {
  margin-top: 63px;
}
.side_title {
}
</style>
