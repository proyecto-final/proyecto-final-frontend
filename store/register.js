export const state = {
  user: {
    name: '',
    username: '',
    email: ''
  }
}

export const mutations = {
  SET_USER (state, value) {
    state.user = value
  }
}
