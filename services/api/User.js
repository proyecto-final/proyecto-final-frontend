export default class User {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  authenticate (user) {
    return this.$axios.$post('/api/user/authenticate', user)
  }

  getProfile (user) {
    return this.$axios.$get('/api/user/profile', user)
  }

  logout () {
    return this.$axios.$post('/api/user/logout')
  }
}
