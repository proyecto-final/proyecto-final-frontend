export default class SearchIp {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  getIp (projectId, ip) {
    return this.$axios.$post(`/api/project/${projectId}/ip-analysis/`, { ip })
  }

  getIpFromLine (projectId, logId, lineId, ip) {
    return this.$axios.$post(`/api/project/${projectId}/ip-analysis/log/${logId}/line/${lineId}`, { ip })
  }

  getLastAnalyzedIPs (projectId, params) {
    return this.$axios.$get(`/api/project/${projectId}/ip-analysis`, { params })
  }
}
