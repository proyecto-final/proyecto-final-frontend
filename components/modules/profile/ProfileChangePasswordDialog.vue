<template>
  <ShAsyncDialog
    width="500"
    :confirm-text="showSuccess ? 'Entendido' : 'Confirmar'"
    :hide-secondary-button="showSuccess"
    :title="showSuccess ? '' : 'Cambiar contraseña'"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="resetDialog"
  >
    <template #activator="{on}">
      <v-icon color="neutral base" v-on="on">
        mdi-chevron-right
      </v-icon>
    </template>
    <template #default>
      <template v-if="showSuccess">
        <div class="d-flex align-center justify-center">
          <v-icon color="success" size="98px">
            mdi-check-circle
          </v-icon>
        </div>
        <div class="d-flex ma-7 align-center justify-center">
          <ShHeading2>
            Tu contraseña se cambió con éxito.
          </ShHeading2>
        </div>
      </template>
      <template v-else>
        <div>
          <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
            <ShBodySmall class="white-text">
              Recordá que tu nueva contraseña deberá contener:
            </ShBodySmall>
            <li>
              <ShBodySmall class="white-text">
                Al menos <strong>1 mayúscula</strong> y <strong>1 minúscula</strong>.
              </ShBodySmall>
            </li>
            <li>
              <ShBodySmall class="white-text">
                Al menos <strong>1 caracter especial</strong>.
              </ShBodySmall>
            </li>
            <li>
              <ShBodySmall class="white-text">
                Al menos <strong>1 número</strong>.
              </ShBodySmall>
            </li>
            <li color="white">
              <ShBodySmall class="white-text">
                Al menos <strong>8 caracteres</strong>.
              </ShBodySmall>
            </li>
          </v-alert>
        </div>
        <div>
          <ShPasswordField
            v-model="user.password"
            label="Contraseña actual"
            :rules="[$rules.required('contraseña')]"
          />
        </div>
        <div>
          <ShPasswordField
            v-model="user.newPassword"
            label="Contraseña nueva"
            :rules="[$rules.required('contraseña'), $rules.hasLengthBetween(8,32), $rules.hasLowercase,
                     $rules.hasUppercase, $rules.hasNumber, $rules.hasSpecialCharacter]"
          />
        </div>
        <div>
          <ShPasswordField
            v-model="user.repeatNewPassword"
            label="Repetir contraseña nueva"
            :rules="[$rules.required('contraseña'), passwordMatches]"
          />
        </div>
      </template>
    </template>
  </ShAsyncDialog>
</template>
<script>
const getEmptyPassword = () => ({
  password: '',
  newPassword: '',
  repeatNewPassword: ''
})
export default {
  data: () => ({
    user: getEmptyPassword(),
    showSuccess: false
  }),
  methods: {
    save () {
      if (this.showSuccess) {
        return Promise.resolve(true)
      }
      return this.$userService.update(this.user).catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      }).then((result) => {
        if (result) {
          this.showSuccess = true
        }
        return false
      })
    },
    resetDialog () {
      this.user = getEmptyPassword()
      this.showSuccess = false
    },
    passwordMatches () {
      return this.user.newPassword === this.user.repeatNewPassword || 'La contraseña no coincide'
    }
  }
}
</script>
