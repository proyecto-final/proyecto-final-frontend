<template>
  <div class="d-flex justify-end">
    <ShHeading2 class="neutral-text mt-3 ml-2">
      Información personal
    </ShHeading2>
    <v-row justify="end" align="center" class="mt-2">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="1" class="mr-14">
          <v-card-text>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall class="neutral-lighten-text">
                  Nombre y apellido
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall class="neutral-text strong-text">
                  {{ user.name }}
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall class="neutral-lighten-text">
                  Nombre de usuario
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall class="neutral-text strong-text">
                  {{ user.username }}
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall class="neutral-lighten-text">
                  E-mail
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall class="neutral-text strong-text">
                  {{ user.email }}
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7 align-center">
              <div class="d-flex flex-column">
                <ShBodySmall class="neutral-lighten-text">
                  Contraseña
                </ShBodySmall>
                <ShBodySmall class="neutral-text">
                  <!--Cambiar "neutral-text" cuando exista el color gris claro-->
                  Cambiá tu contraseña
                </ShBodySmall>
              </div>
              <div>
                <v-icon color="neutral base">
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
  data: () => ({
    user: {
      name: '',
      username: '',
      email: ''
    }
  }),
  fetch () {
    this.$userService.getProfile().then((user) => {
      this.user = user
    }).catch(() => {
      this.$noty.warn('Hubo un error al cargar tu perfil de usuario')
    })
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Perfil')
  }
}
</script>
