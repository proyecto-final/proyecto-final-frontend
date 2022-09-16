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
                <img :src="qrUrl">
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
import { mapState } from 'vuex'
const qrcode = require('qrcode')
const speakeasy = require('speakeasy')
export default {
  layout: 'login',
  props: {
    organizationId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    organization: {},
    loading: false,
    isValidToken: false,
    qrUrl: '',
    tempSecret: ''
  }),
  computed: {
    ...mapState('register', ['user'])
  },
  created () {
    this.loading = true
    this.$organizationService.validateToken(this.$route.query.token)
      .then((response) => {
        this.organization = response
        this.isValidToken = true
      }).catch(() => {
        this.isValidToken = false
      }).finally(() => {
        this.getSecret()
        this.loading = false
      })
  },
  methods: {
    register (userCode) {
      // There was an issue with speakeasy built-in base32 verify function. In case of error, check:
      // https://github.com/speakeasyjs/speakeasy/issues/105
      const verified = speakeasy.totp.verify({
        secret: this.tempSecret,
        encoding: 'base32',
        token: userCode
      })
      this.loading = true
      if (verified) {
        this.$userService.createUser({
          ...this.user, token: this.$route.query.token, mfaSecret: this.tempSecret
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
      } else {
        this.$noty.warn('Código incorrecto, intente nuevamente')
        this.loading = false
      }
    },
    getSecret () {
      const authenticatorName = `Sherlock (${this.user.username})`
      const secret = speakeasy.generateSecret({ name: authenticatorName })
      const qrSecret = secret.otpauth_url
      this.tempSecret = secret.base32
      qrcode.toDataURL(qrSecret)
        .then((url) => {
          this.qrUrl = url
        })
        .catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
        })
    }
  }
}
</script>
