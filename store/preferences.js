export const state = {
  showSidebar: false
}

export const mutations = {
  SET_SHOW_SIDEBAR (state, value) {
    localStorage.setItem('showSidebar', value)
    state.showSidebar = value
  }
}

export const actions = {
}
