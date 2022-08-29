export default class SearchIp {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  getIp (projectId, ip) {
    return this.$axios.$post(`/api/project/${projectId}/ip-analysis/`, { ip })
  }

  getLastAnalyzedIPs (projectId, params) {
    return this.$axios.$get(`/api/project/${projectId}/ip-analysis`, { params })
  }
}
