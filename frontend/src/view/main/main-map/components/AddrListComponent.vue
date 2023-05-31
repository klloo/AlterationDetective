<template>
  <div>
    <div v-show="isEmpty(addrList)" class="mt_32 d_flex justify_center">
      검색 결과가 없습니다.
    </div>
    <ul class="mt_8 tal scrollable">
      <li v-for="(addr, index) in addrList" :key="index" @click="selectAddr(addr.roadAddr)">
        <el-row>
          <!-- 도로명 주소 -->
          <div class="road-addr">
            {{ addr.roadAddr }}
          </div>
          <!-- 지번 주소 -->
          <div class="jibun-addr">{{ addr.jibunAddr }}</div>
        </el-row>
        <el-divider v-if="index != addrList.length - 1"></el-divider>
      </li>
    </ul>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';

export default {
  name: 'AddrListComponent',
  props: {
    addrList: {
      type: Array,
      defualt: [],
    },
  },
  methods: {
    isEmpty,
    selectAddr(addr) {
      this.$emit('select-addr', addr);
    },
  },
};
</script>

<style lang="css"></style>
