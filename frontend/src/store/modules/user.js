const user = {
  state: {
    /**
     * 로그인된 계정 정보
     */
    userInfo: null,
    /**
     * 현위치
     */
    curPos: {
      latitude: 37,
      longitude: 127,
    }
  },
  mutations: {
    /**
     * 로그인된 계정 정보를 설정한다.
     */
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    /**
     * 현위치를 설정한다.
     */
    setCurPos: (state, curPos) => {
      state.curPos = curPos;
    }
  },
  actions: {
    /**
     * 로그인된 계정의 정보를 설정한다.
     */
     setUserInfo: ({ commit }, userInfo) => {
      commit('setUserInfo', userInfo);
    },
    /**
     * 현위치를 설정한다.
     */
    setCurPos: ({ commit }, curPos) => {
      commit('setCurPos', curPos);
    },
  },
};

export default user;
