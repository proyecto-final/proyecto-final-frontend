export default class Timeline {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  get (projectId, params) {
    return this.$axios.$get(`/api/project/${projectId}/timeline`, { params })
  }

  deleteTimeline (projectId, timelineId) {
    return this.$axios.$delete(`/api/project/${projectId}/timeline/${timelineId}`)
  }

  update (projectId, timelineId, timeline) {
    return this.$axios.$patch(`/api/project/${projectId}/timeline/${timelineId}`, timeline)
  }
}
