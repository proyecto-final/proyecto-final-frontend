export default class Rules {
  required (field) {
    return value => !!value || `El campo ${field} es obligatorio`
  }
}
