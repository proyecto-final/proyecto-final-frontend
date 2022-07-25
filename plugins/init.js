export default function ({ store, app }) {
  const currentProject = localStorage.getItem('selectedProjectId')
  if (currentProject) {
    store.commit('user/SET_SELECTED_PROJECT_ID', currentProject)
  }
  const showSidebar = localStorage.getItem('showSidebar')
  store.commit('preferences/SET_SHOW_SIDEBAR', showSidebar === 'true')
}
