<template>
  <div class="d-flex justify-end">
    <ShHeading2 class="neutral-text">
      Información personal
    </ShHeading2>
    <v-row justify="end" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card flat>
          <v-card-text>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall class="neutral-text">
                  Nombre y apellido
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall class="neutral-text strong-text">
                  Caligula Gula
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall class="neutral-text">
                  Nombre de usuario
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall class="neutral-text strong-text">
                  @cgula
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall class="neutral-text">
                  E-mail
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall class="neutral-text strong-text">
                  {{ tuVariable }}
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall class="neutral-text">
                  Contraseña
                </ShBodySmall>
              </div>
              <div>
                <v-icon class="neutral-text strong-text">
                  mdi-chevron-right
                </v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Perfil')
  }
}
</script>
<style scoped>
.sh-card {

}
</style>
