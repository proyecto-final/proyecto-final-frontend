export default class Log {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  get (projectId, params) {
    return this.$axios.$get(`/api/project/${projectId}/correlate/log`, { params })
  }

  getLog (projectId, logId) {
    // return this.$axios.$get(`/api/project/${projectId}/correlate/log/${logId}`)
    return Promise.resolve({ differentEvents: [1, 5145] })
  }

  deleteLog (projectId, logId) {
    return this.$axios.$delete(`/api/project/${projectId}/correlate/log/${logId}`)
  }

  save (projectId, files, metadatas) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file, file.name)
    })
    formData.append('metadata', JSON.stringify(metadatas))
    return this.$axios.$post(`/api/project/${projectId}/correlate/log`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  update (projectId, logId, log) {
    return this.$axios.$patch(`/api/project/${projectId}/correlate/log/${logId}`, log)
  }

  getLines (projectId, logId, params) {
    const qs = require('qs')
    return this.$axios.$get(`/api/project/${projectId}/correlate/log/${logId}/line`, {
      params,
      paramsSerializer (params) {
        return qs.stringify(params, { arrayFormat: 'comma' })
      }
    })
  }

  updateLine (projectId, logId, lineId, line) {
    return this.$axios.$patch(`/api/project/${projectId}/correlate/log/${logId}/line/${lineId}`, line)
  }

  getVulnerabilities (projectId, params) {
    return this.$axios.$get(`/api/project/${projectId}/correlate/vulnerability`, { params })
  }

  saveVulnerability (projectId, vulnerability) {
    return this.$axios.$post(`/api/project/${projectId}/correlate/vulnerability`, vulnerability)
  }

  setMarkedLines (projectId, logId, lineIds) {
    return this.$axios.$post(`/api/project/${projectId}/correlate/log/${logId}/markAsSelected`, { lineIds })
  }
}
