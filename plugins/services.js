import { camelCase } from 'lodash'
import NotificationSnackbar from '~/services/helpers/NotificationSnackbar'

// DYNAMIC IMPORT OF SERVICES FROM API
const clazzList = []
const requireService = require.context(
  '~/services/api/',
  false,
  /[A-Z]\w+\.(js)$/
)
requireService.keys().forEach((fileName) => {
  const clazz = requireService(fileName)
  const serviceName = camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1')) + 'Service'
  clazzList.push({ Clazz: clazz.default, serviceName })
})
export default function ({ app, store }, inject) {
  const notificationSnackbar = new NotificationSnackbar()
  inject('noty', notificationSnackbar)
  clazzList.forEach((clazzObject) => {
    const instance = new clazzObject.Clazz({ $axios: app.$axios, store, router: app.router })
    inject(clazzObject.serviceName, instance)
  })
}
