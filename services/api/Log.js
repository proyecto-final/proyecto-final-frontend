export default class Log {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  get (params) {
    return Promise.resolve({ rows: [{ id: '62db72a21dca35eb93c22efe', name: 'Logcito 1', description: 'Desc log 1', date: '2022-07-17 22:21:58', status: 'processed' }, { id: '2', name: 'Logcito 2', description: 'Desc log 2', date: '2022-07-17 22:21:58', status: 'loading' }], count: 2 })
  }

  deleteLog (projectId, logId) {
    return this.$axios.delete(`/api/project/${projectId}/correlate/log/${logId}`)
  }
}
