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

  getUsers (organizationId, params) {
    return this.$axios.$get(`/api/organization/${organizationId}/user`, { params })
  }

  save (organization) {
    return this.$axios.$post('/api/organization', organization)
  }

  update (organization) {
    return this.$axios.$patch(`/api/organization/${organization.id}`, organization)
  }

  getInvitationToken (organizationId) {
    return this.$axios.$post(`/api/organization/${organizationId}/invitation-token`)
  }
}
