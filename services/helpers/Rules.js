export default class Rules {
  required (field) {
    return value => !!value || `El campo ${field} es obligatorio`
  }

  hasLengthBetween (min, max) {
    return value => (value.length >= min && value.length <= max) || `El campo debe tener entre ${min} y ${max} caracteres`
  }

  hasSpecialCharacter (value) {
    return /[^a-zA-Z0-9]/.test(value) || 'El campo debe tener al menos un caracter especial'
  }

  hasNumber (value) {
    return /\d/u.test(value) || 'El campo debe tener al menos un número'
  }

  hasUppercase (value) {
    return /\p{Lu}/u.test(value) || 'El campo debe tener al menos una mayúscula'
  }

  hasLowercase (value) {
    return /\p{Ll}/u.test(value) || 'El campo debe tener al menos una minúscula'
  }

  fieldLength (field, min, max) {
    return value => ((min <= value.length) && (value.length <= max)) || `El campo ${field} debe tener entre ${min} y ${max} caracteres`
  }
}
