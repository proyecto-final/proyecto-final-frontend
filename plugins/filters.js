import Vue from 'vue'

Vue.filter('date', (value) => {
  if (!value) {
    return value
  }
  const date = new Date(value)
  const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month}, ${year}`
})
Vue.filter('dateTime', (value) => {
  if (!value) {
    return value
  }
  const date = new Date(value)
  const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month}, ${year} ${date.getHours()}:${date.getMinutes()}`
})
