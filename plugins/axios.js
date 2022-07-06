export default function ({ store, $axios, redirect, app, $nuxt, $route }) {
  $axios.onResponse((response) => {
    if ([403].includes(response?.status)) {
      return redirect('/logout')
    }
    return response
  })

  $axios.onError((error) => {
    const code = parseInt(error.response?.status || 0)
    const has2Logout = code === 401
    if (has2Logout) {
      return redirect('/logout')
    }
  })
  $axios.onRequest((request) => {
    request.headers.common['Content-Language'] = 'en'
  })
}
