export const state = {
  user: {
    name: '',
    username: '',
    email: ''
  },
  projectMenus: [],
  isLoadingUser: false,
  selectedProjectId: null
}

export const getters = {
  selectedProject (state) {
    return state.projectMenus.find(project => project.id.toString() === state.selectedProjectId?.toString())
  }
}

export const mutations = {
  SET_USER (state, value) {
    state.user = value
  },
  SET_IS_LOADING_USER (state, value) {
    state.isLoadingUser = value
  },
  SET_PROJECT_MENUS (state, value) {
    state.projectMenus = value
  },
  SET_SELECTED_PROJECT_ID (state, value) {
    localStorage.setItem('selectedProjectId', value)
    state.selectedProjectId = value
  }
}

export const actions = {
  getUser ({ commit, state }) {
    commit('SET_IS_LOADING_USER', true)
    this.$userService.getProfile().then((user) => {
      commit('SET_USER', user)
      const projects = user.projects.map(project => ({
        ...project,
        menus: [{
          icon: 'mdi-file-code',
          text: 'Logs',
          to: `/${project.id}/logs`
        },
        {
          icon: 'mdi-chart-box',
          text: 'Timelines',
          to: `/${project.id}/timelines`
        },
        {
          icon: 'mdi-shield-search',
          text: 'Buscar IP',
          to: `/${project.id}/search-ip`
        }]
      }))
      commit('SET_PROJECT_MENUS', projects)
      const existPreferredProject = projects.find(project => project.id.toString() === state.selectedProjectId)
      if (!existPreferredProject) {
        commit('SET_SELECTED_PROJECT_ID', projects[0].id)
      }
    }).finally(() => { commit('SET_IS_LOADING_USER', false) })
  }
}
