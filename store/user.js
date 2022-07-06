export const state = {
  user: {},
  isLoadingUser: false
}

export const mutations = {
  SET_USER (state, value) {
    state.user = value
  },
  SET_IS_LOADING_USER (state, value) {
    state.isLoadingUser = value
  }
}

export const actions = {
  getUser ({ commit }) {
    commit('SET_IS_LOADING_USER', true)
    this.$userService.getProfile().then((user) => {
      commit('SET_USER', user)
    }).finally(() => { commit('SET_IS_LOADING_USER', false) })
  }
}
