export default class Timeline {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  get (projectId, params) {
    return Promise.resolve([{ _id: '1', title: 'Timeline 1', description: 'Un timeline', updatedAt: '2022-07-27T23:35:26.786Z', eventsCount: '123' }, { _id: '2', title: 'Timeline 2', description: 'Otro timeline', updatedAt: '2022-07-27T23:35:26.786Z', eventsCount: '567' }])
  }

  update (projectId, timelineId, timeline) {
    return this.$axios.$patch(`/api/project/${projectId}/timeline/${timelineId}`, timeline) // TO-DO: Chequear cuando este listo el back
  }
}
