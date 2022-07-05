<template>
  <ShAsyncDialog
    width="500"
    :confirm-text="showSuccess ? 'Entendido' : 'Confirmar'"
    :title="showSuccess ? '' : 'Cambiar contraseña'"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="setPassword"
  >
    <template #activator="{on}">
      <v-icon color="neutral base" v-on="on">
        mdi-chevron-right
      </v-icon>
    </template>
    <template #default>
      <template v-if="showSuccess">
        <v-icon color="success">
          mdi-check-circle
        </v-icon>
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
            v-model="user.currentPassword"
            label="Contraseña actual"
            :rules="[$rules.required('contraseña')]"
          />
        </div>
        <div>
          <ShPasswordField
            v-model="user.newPassword"
            label="Contraseña nueva"
            :rules="[$rules.required('contraseña')]"
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
  currentPassword: '',
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
      return this.$userService.savePassword(this.user.currentPassword, this.user.newPassword).catch((error) => {
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
    setPassword () {
      this.user = getEmptyPassword()
    },
    passwordMatches () {
      if (this.user.newPassword !== this.user.repeatNewPassword) {
        return 'La contraseña no coincide'
      }
    }
  }
}
</script>
