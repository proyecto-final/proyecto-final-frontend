export default class Organization {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  get (params) {
    return this.$axios.$get('/api/organization', { params })
  }

  getSpecific (organizationId) {
    return this.$axios.$get(`/api/organization/${organizationId}`)
  }

  save (organization) {
    return this.$axios.$post('/api/organization', organization)
  }
}
