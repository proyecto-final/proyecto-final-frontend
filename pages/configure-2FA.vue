<template>
  <v-row justify="center" class="h-100">
    <v-col cols="12" sm="8" md="6" lg="5" class="d-flex align-center">
      <v-card elevation="0" class="w-100">
        <v-card-text class="pa-8">
          <template v-if="loading">
            <v-progress-circular color="primary" indeterminate />
            <ShBody>Procesando invitación...</ShBody>
          </template>
          <div v-else-if="isValidToken">
            <div class="mb-4">
              <ShHeading3 neutral>
                Configurar el 2FA
              </ShHeading3>
            </div>
            <div class="mb-4">
              <ShDisplayS>
                Escaneá el código QR
              </ShDisplayS>
            </div>
            <div class="mb-4">
              <ShBody>
                Deberás escanear el código con el auntenticador que uses para configurar el doble factor de seguridad.
              </ShBody>
            </div>
            <div class="d-flex justify-center my-4">
              <div>
                <ShDisplayXL neutral>
                  ACÁ VA EL QR
                </ShDisplayXL>
              </div>
            </div>
            <div class="mb-4">
              <ShBody>
                Luego, ingresá el código correspondiente debajo.
              </ShBody>
              <v-otp-input
                length="6"
                class="mt-4"
                @finish="register"
              />
            </div>
            <v-expand-transition>
              <div v-show="error">
                <v-alert type="warning" icon="mdi-alert">
                  {{ error }}
                </v-alert>
              </div>
            </v-expand-transition>
            <ShButton block :loading="loading">
              Configurar
            </ShButton>
          </div>
          <template v-else>
            <div class="d-flex justify-center">
              <v-icon x-large color="primary">
                mdi-robot-confused
              </v-icon>
            </div>
            <div class="my-2">
              <ShHeading2>Ha ocurrido un error</ShHeading2>
            </div>
            <div>
              <ShBody>
                Por favor contáctese con su administrador para solucionar el problema.
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
    register () {
      this.$noty.success('Se registró correctamente al usuario')
      this.$router.push('/login')
    }
  }
}
</script>
