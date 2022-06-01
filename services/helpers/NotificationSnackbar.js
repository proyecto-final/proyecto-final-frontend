import Vue from 'vue'
import Snackbar from '@/components/molecules/snackbars/ShSnackbar'
export default class NotificationSnackbar {
  constructor () {
    this.observers = []
  }

  attach (observer) {
    this.observers.push(observer)
  }

  // { title, text, timeout, type, action, icon }
  toast (text, type, params) {
    const parent = window.$nuxt
    const component = new (Vue.extend(Snackbar))({ parent }).$mount()
    document.querySelector('.v-main')?.appendChild(component.$el)
    component.show({ text, type, ...params })
  }

  error (text, params) {
    this.toast(text, 'error', params)
  }

  warn (text, params) {
    this.toast(text, 'warning', params)
  }

  notify (text, params) {
    this.toast(text, 'info', params)
  }

  success (text, params) {
    this.toast(text, 'success', params)
  }
}
