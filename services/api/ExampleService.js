export default class ExampleService {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  loadAllContacts (params) {
    return this.$axios.$get('/api/endpoint/', { params })
  }
}
