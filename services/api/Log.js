export default class Log {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  get (projectId, params) {
    return this.$axios.$get(`/api/project/${projectId}/correlate/log`, { params })
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
    return this.$axios.$get(`/api/project/${projectId}/correlate/log/${logId}/line`, { params })
  }

  updateLine (projectId, logId, lineId, selection) {
    return this.$axios.$patch(`/api/project/${projectId}/correlate/log/${logId}/line/${lineId}`, selection)
  }

  getVulnerabilities (projectId, params) {
    return this.$axios.$get(`/api/project/${projectId}/correlate/vulnerability`, { params })
  }

  saveVulnerability (projectId, vulnerability) {
    return this.$axios.$post(`/api/project/${projectId}/correlate/vulnerability`, vulnerability)
  }
}
