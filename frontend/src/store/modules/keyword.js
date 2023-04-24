import { findIndex } from 'lodash';

const keyword = {
    state: {
      /**
       * 최근검색어 키워드 목록
       */
      recentKeywords: [],
    },
    mutations: {
      /**
       * 최근 검색 키워드를 추가한다.
       */
      addRecentKeyword: (state, keyword) => {
        const isExist = state.recentKeywords.some((item) => {
            return item.type === keyword.type && item.keyword === keyword.keyword;
        });
        if(!isExist) {
            state.recentKeywords.unshift(keyword);
            if(state.recentKeywords.length > 10) {
                state.recentKeywords.pop();
            }
        }
      },
      /**
       * 특정 키워드를 삭제한다.
       */
      deleteRecentKeyword: (state, keyword) => {
        const delIndx = findIndex(state.recentKeywords, 
            item => item.type === keyword.type && item.keyword === keyword.keyword);
        state.recentKeywords.splice(delIndx, 1);
      },
      /**
       * 모든 키워드를 삭제한다.
       */
      deleteAllRecentKeyword: (state) => {
        state.recentKeywords = [];
      },
    },
    actions: {
      /**
       * 최근 검색 키워드를 추가한다.
       */
       addRecentKeyword: ({ commit }, keyword) => {
        commit('addRecentKeyword', keyword);
      },
      /**
       * 특정 키워드를 삭제한다.
       */
      deleteRecentKeyword: ({ commit }, keyword) => {
        commit('deleteRecentKeyword', keyword);
      },
      /**
       * 모든 키워드를 삭제한다.
       */
      deleteAllRecentKeyword: ({ commit }) => {
        commit('deleteAllRecentKeyword', keyword);
      },
    },
  };
  
  export default keyword;
  