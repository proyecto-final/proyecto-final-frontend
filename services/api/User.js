export default class User {
  constructor ({ $axios, store, router }) {
    this.$axios = $axios
    this.store = store
    this.router = router
  }

  authenticate (user) {
    return this.$axios.$post('/api/user/authenticate', user)
  }

  getProfile () {
    return this.$axios.$get('/api/user/me')
  }

  update (user) {
    return this.$axios.$patch('/api/user', user)
  }

  logout () {
    return this.$axios.$post('/api/user/logout')
  }

  createUser ({ username, name, password, email, token, mfaSecret }) {
    return this.$axios.$post('/api/organization/user', { username, name, password, email, token, mfaSecret })
  }
}
