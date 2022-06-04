<template>
  <v-row justify="center" class="h-100">
    <v-col cols="12" sm="8" md="6" class="d-flex align-center">
      <v-card elevation="0" class="w-100">
        <v-card-text class="pa-8">
          <v-form ref="form" @submit.prevent="login">
            <div class="mb-4">
              <ShContentHeader>
                Inicio de sesión
              </ShContentHeader>
            </div>
            <div class="d-flex justify-center mb-8">
              <div>
                <v-img
                  src="logo.svg"
                  width="200"
                />
              </div>
            </div>
            <div class="mb-4">
              <ShContentTitle>
                Para acceder, ingresá tus datos
              </ShContentTitle>
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
            <div class="mb-8">
              <NuxtLink class="text-decoration-none" to="/forgot-password">
                <ShSpecialLabel>
                  ¿Olvidaste tu contraseña?
                </ShSpecialLabel>
              </NuxtLink>
            </div>
            <ShButton block large type="submit">
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
    }
  }),
  methods: {
    login () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.$userService.authenticate(this.user)
    }
  }
}
</script>
