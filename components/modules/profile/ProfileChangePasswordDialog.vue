<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Confirmar"
    title="Cambiar contraseña"
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
  </ShAsyncDialog>
</template>
<script>
const getEmptyPassword = () => ({
  currentPassword: '',
  newPassword: '',
  repeatNewPassword: ''
})
export default {
  data: () => ({ user: getEmptyPassword() }),
  methods: {
    save () {
      return this.$userService.savePassword(this.user.currentPassword, this.user.newPassword).catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      })
    },
    setPassword () {
      this.user = getEmptyPassword()
    },
    passwordMatches () {
      if (this.user.newPassword !== this.user.repeatNewPassword) {
        return 'Las contraseñas no coinciden'
      }
    }
  }
}
</script>
