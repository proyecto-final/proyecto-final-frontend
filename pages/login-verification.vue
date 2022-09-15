<template>
  <v-row justify="center" class="h-100">
    <v-col cols="12" sm="8" md="6" lg="5" class="d-flex align-center">
      <v-card elevation="0" class="w-100">
        <v-card-text class="pa-8">
          <template v-if="loading">
            <v-progress-circular color="primary" indeterminate />
            <ShBody>Procesando la sesión...</ShBody>
          </template>
          <div>
            <div class="mb-4">
              <ShHeading3 neutral>
                Verificación
              </ShHeading3>
            </div>
            <div class="mb-4">
              <ShDisplayS>
                Ingresá los 6 dígitos de tu autenticador
              </ShDisplayS>
            </div>
            <div class="mb-1">
              <v-otp-input
                length="6"
                @finish="login"
              />
            </div>
            <div class="mb-8">
              <ShBodySmall class="neutral-lighten-text">
                ¿Ya no tenés acceso a tu dispositivo?
              </ShBodySmall>
            </div>
            <v-expand-transition>
              <div v-show="error">
                <v-alert type="warning" icon="mdi-alert">
                  {{ error }}
                </v-alert>
              </div>
            </v-expand-transition>
            <ShButton block :loading="loading">
              Acceder
            </ShButton>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
const speakeasy = require('speakeasy')
export default {
  layout: 'login',
  data: () => ({
    loading: false
  }),
  methods: {
    login (userCode) {
      const verified = speakeasy.totp.verify({
        secret: this.tempSecret, // traerlo del back
        encoding: 'base32',
        token: userCode
      })
      if (verified) {
        this.$router.push('/profile')
      }
    }
  }
}
</script>
