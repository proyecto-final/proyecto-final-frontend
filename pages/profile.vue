<template>
  <div class="d-flex justify-end">
    <ShHeading2 neutral class="mt-3 ml-2">
      Información personal
    </ShHeading2>
    <v-row justify="end" align="center" class="mt-2">
      <v-col cols="12" sm="10" md="8">
        <v-card elevation="1" class="mr-14">
          <v-card-text>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall neutral>
                  Nombre y apellido
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall neutral strong>
                  {{ user.name }}
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall neutral>
                  Nombre de usuario
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall neutral strong>
                  {{ user.username }}
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7">
              <div>
                <ShBodySmall neutral>
                  E-mail
                </ShBodySmall>
              </div>
              <div>
                <ShBodySmall neutral strong>
                  {{ user.email }}
                </ShBodySmall>
              </div>
            </div>
            <div class="d-flex justify-space-between ma-7 align-center">
              <div class="d-flex flex-column">
                <ShBodySmall neutral>
                  Contraseña
                </ShBodySmall>
                <ShBodySmall class="neutral-lighten-text">
                  Cambiá tu contraseña
                </ShBodySmall>
              </div>
              <div>
                <div>
                  <ProfileChangePasswordDialog />
                </div>
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
    this.$store.commit('navigation/CAN_GO_BACK', false)
  }
}
</script>
