<template>
  <v-row justify="center" class="h-100">
    <v-col cols="12" sm="8" md="6" lg="5" class="d-flex align-center">
      <v-card elevation="0" class="w-100">
        <v-card-text class="pa-8">
          <v-form ref="form" @submit.prevent="login">
            <div class="mb-4">
              <ShHeading3 neutral>
                Inicio de sesión
              </ShHeading3>
            </div>
            <div class="d-flex justify-center mb-8">
              <div>
                <ShLogo width="200" />
              </div>
            </div>
            <div class="mb-4">
              <ShDisplayS>
                Para acceder, ingresá tus datos
              </ShDisplayS>
            </div>
            <div>
              <ShTextField
                v-model="user.username"
                label="Usuario o e-mail"
                :rules="[$rules.required('usuario')]"
              />
              <ShPasswordField
                v-model="user.password"
                label="Contraseña"
                :rules="[$rules.required('contraseña')]"
              />
            </div>
            <v-expand-transition>
              <div v-show="error">
                <v-alert type="warning" icon="mdi-alert">
                  {{ error }}
                </v-alert>
              </div>
            </v-expand-transition>
            <div class="mb-8">
              <NuxtLink class="text-decoration-none" to="/forgot-password">
                <ShSpecialLabel neutral>
                  ¿Olvidaste tu contraseña?
                </ShSpecialLabel>
              </NuxtLink>
            </div>
            <ShButton block type="submit" :loading="loading">
              Iniciar sesión
            </ShButton>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'login',
  data: () => ({
    user: {
      username: '',
      password: ''
    },
    loading: false,
    error: ''
  }),
  methods: {
    login () {
      if (!this.$refs.form.validate() || this.loading) {
        return
      }
      this.error = ''
      this.loading = true
      this.$userService.authenticate(this.user).then((user) => {
        this.$router.push('/profile')
      }).catch((error) => {
        this.error = error.response?.data?.msg.pop()
      }).finally(() => { this.loading = false })
    }
  }
}
</script>
