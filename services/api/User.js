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
    return this.$axios.$get('/api/user/me', user)
  }

  savePassword (currentPassword, newPassword) {
    return this.$axios.$patch('/api/user', currentPassword, newPassword)
  }

  logout () {
    return this.$axios.$post('/api/user/logout')
  }
}
