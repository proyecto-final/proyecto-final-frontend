export default class Log {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  get (projectId, params) {
    return this.$axios.delete(`/api/project/${projectId}/correlate/log/`, { params })
  }

  deleteLog (projectId, logId) {
    return this.$axios.delete(`/api/project/${projectId}/correlate/log/${logId}`)
  }
}
