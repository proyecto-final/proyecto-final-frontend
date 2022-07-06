export const state = {
  pageTitle: 'Sherlock',
  canGoBack: false
}

export const mutations = {
  SET_PAGE_TITLE (state, title) {
    state.pageTitle = title
  },
  CAN_GO_BACK (state, canGoBack) {
    state.canGoBack = canGoBack
  }
}
