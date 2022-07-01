export default class Rules {
  required (field) {
    return value => !!value || `El campo ${field} es obligatorio`
  }

  fieldLength (field, min, max) {
    return value => ((min <= value.length) && (value.length <= max)) || `El campo ${field} debe tener entre ${min} y ${max} caracteres`
  }
}
