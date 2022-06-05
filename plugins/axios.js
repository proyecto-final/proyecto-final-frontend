export default function ({ store, $axios, redirect, app, $nuxt, $route }) {
  $axios.onResponse((response) => {
    if ([403].includes(response?.status)) {
      return redirect('/logout')
    }
    return response
  })

  $axios.onError((error) => {
    const code = parseInt(error.response?.status || 0)
    const has2Logout = code === 403
    if (has2Logout) {
      return redirect('/logout')
    }
    if (code === 403) {
      return redirect('/invalid-url')
    }
  })
  $axios.onRequest((request) => {
    request.headers.common['Content-Language'] = 'en'
  })
}
