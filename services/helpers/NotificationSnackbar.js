import Vue from 'vue'
import Snackbar from '@/components/molecules/snackbars/ShSnackbar'
export default class NotificationSnackbar {
  constructor () {
    this.observers = []
  }

  attach (observer) {
    this.observers.push(observer)
  }

  toast (text, timeout, type, title, action) {
    const parent = window.$nuxt
    const component = new (Vue.extend(Snackbar))({ parent }).$mount()
    document.querySelector('.v-main')?.appendChild(component.$el)
    component.show({ text, timeout, type, title, snackbarAction: action })
  }

  error (text, title, action, timeout = 5000) {
    this.toast(text, timeout, 'error', title, action)
  }

  warn (text, title, action, timeout = 5000) {
    this.toast(text, timeout, 'warning', title, action)
  }

  message (text, title, action, timeout = 5000) {
    this.toast(text, timeout, 'message', title, action)
  }

  notify (text, title, action, timeout = 5000) {
    this.toast(text, timeout, 'info', title, action)
  }

  success (text, title, action, timeout = 5000) {
    this.toast(text, timeout, 'success', title, action)
  }

  desktopNotification (title, body) {
    Notification.requestPermission((result) => {
      if (result === 'granted') {
        try {
          // eslint-disable-next-line no-new
          new Notification(title, {
            body
          })
        } catch (e) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              body,
              vibrate: [100, 50, 100]
            })
          })
        }
      }
    })
  }
}
