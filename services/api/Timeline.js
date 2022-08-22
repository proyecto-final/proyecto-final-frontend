export default class Timeline {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  get (projectId, params) {
    return this.$axios.$get(`/api/project/${projectId}/timeline`, { params })
  }

  getSpecific (projectId, timelineId) {
    return this.$axios.$get(`/api/project/${projectId}/timeline/${timelineId}`)
  }

  deleteTimeline (projectId, timelineId) {
    return this.$axios.$delete(`/api/project/${projectId}/timeline/${timelineId}`)
  }

  update (projectId, timelineId, timeline) {
    return this.$axios.$patch(`/api/project/${projectId}/timeline/${timelineId}`, { ...timeline, lines: timeline.lines.map(({ line, tags }) => ({ id: line, tags })) })
  }

  create (projectId, timeline) {
    return this.$axios.$post(`/api/project/${projectId}/timeline`, timeline)
  }

  downloadPdf (projectId, timelineId) {
    return this.$axios.$get(`/api/project/${projectId}/timeline/${timelineId}/report`, {
      headers: {
        accept: 'application/pdf'
      },
      responseType: 'blob'
    })
  }

  updateFromLog (projectId, timelineId) {
    return this.$axios.$post(`/api/project/${projectId}/timeline/${timelineId}/refresh`)
  createTimelineInvitationToken (projectId, timelineId) {
    return this.$axios.$post(`/api/project/${projectId}/timeline/${timelineId}/generate-token`)
  }

  getByToken (token) {
    const dummyValue = '57'
    return this.$axios.$get(`/api/project/${dummyValue}/timeline/external/${token}`)
  }
}
