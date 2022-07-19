<template>
  <v-row justify="center" class="h-100">
    <v-col cols="12" sm="8" md="6" lg="5" class="d-flex align-center">
      <v-card elevation="0" class="w-100">
        <v-card-text class="pa-8">
          <template v-if="loading">
            <v-progress-circular color="primary" indeterminate />
            <ShBody>Procesando invitacion...</ShBody>
          </template>
          <v-form v-else-if="isValidToken" ref="form" @submit.prevent="register">
            <div class="mb-4">
              <ShHeading3 neutral>
                Registro
              </ShHeading3>
            </div>
            <div class="d-flex justify-center mb-8">
              <div>
                <ShDisplayXL neutral>
                  {{ organization.name }}
                </ShDisplayXL>
              </div>
            </div>
            <div class="mb-4">
              <ShDisplayS>
                Para registrarte, completá tus datos
              </ShDisplayS>
            </div>
            <div>
              <ShTextField
                v-model="user.name"
                label="Nombre completo"
                :rules="[$rules.required('nombre completo')]"
              />
              <ShTextField
                v-model="user.email"
                label="E-mail"
                :rules="[$rules.required('email')]"
              />
              <ShTextField
                v-model="user.username"
                label="Usuario"
                :rules="[$rules.required('usuario')]"
              />
              <ShPasswordField
                v-model="user.password"
                label="Contraseña"
                :rules="[$rules.required('contraseña'), $rules.hasLengthBetween(8,32), $rules.hasLowercase,
                         $rules.hasUppercase, $rules.hasNumber, $rules.hasSpecialCharacter]"
              />
              <ShPasswordField
                v-model="user.repeatedPassword"
                label="Repetir contraseña"
                :rules="[$rules.required('repetir contraseña'), passwordMatches]"
              />
            </div>
            <v-expand-transition>
              <div v-show="error">
                <v-alert type="warning" icon="mdi-alert">
                  {{ error }}
                </v-alert>
              </div>
            </v-expand-transition>
            <ShButton block type="submit" :loading="loading">
              Registrarse
            </ShButton>
          </v-form>
          <template v-else>
            <div class="d-flex justify-center">
              <v-icon x-large color="primary">
                mdi-robot-confused
              </v-icon>
            </div>
            <div class="my-2">
              <ShHeading2>Enlace de invitación inválido</ShHeading2>
            </div>
            <div>
              <ShBody>
                El enlace de invitación utilizado no es válido, por favor
                contáctese con su administrador para generar uno nuevo
              </ShBody>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'login',
  props: {
    organizationId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    user: {
      name: '',
      email: '',
      username: '',
      password: '',
      repeatedPassword: ''
    },
    organization: {},
    loading: false,
    isValidToken: false
  }),
  created () {
    this.loading = true
    this.$organizationService.validateToken(this.$route.query.token)
      .then((response) => {
        this.organization = response
        this.isValidToken = true
      }).catch(() => {
        this.isValidToken = false
      }).finally(() => { this.loading = false })
  },
  methods: {
    passwordMatches () {
      return this.user.password === this.user.repeatedPassword || 'La contraseña no coincide'
    },
    register () {
      if (!this.$refs.form.validate() || this.loading) {
        return
      }
      this.loading = true
      this.$userService.createUser({
        ...this.user, token: this.$route.query.token
      }).then(() => {
        this.$noty.success('Se registró correctamente al usuario')
        this.$router.push('/login')
      }).catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
