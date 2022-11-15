const user = {
  state: {
    /**
     * 로그인된 계정 정보
     */
    userInfo: null,
  },
  mutations: {
    /**
     * 로그인된 계정 정보를 설정한다.
     */
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
    },
  },
  actions: {
    /**
     * 로그인된 계정의 정보를 설정한다.
     */
     setUserInfo: ({ commit }, userInfo) => {
      commit('setUserInfo', userInfo);
    },
  },
};

export default user;
