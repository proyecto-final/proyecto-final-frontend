<template>
  <div>
    <v-tabs>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Información
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-lock
        </v-icon>
        Datos
      </v-tab>

      <v-tab-item>
        <div class="d-flex justify-end">
          <ShHeading2 class="neutral-text mt-3 ml-2">
            Información organizacional
          </ShHeading2>
          <v-row justify="end" align="center" class="mt-2">
            <v-col cols="12" sm="8" md="6">
              <v-card elevation="1" class="mr-14">
                <v-card-text>
                  <div class="d-flex justify-space-between ma-7">
                    <div>
                      <ShBodySmall class="neutral-lighten-text">
                        Nombre de la organización
                      </ShBodySmall>
                    </div>
                    <div>
                      <ShBodySmall class="neutral-text strong-text">
                        {{ organization.name }}
                      </ShBodySmall>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between ma-7 align-center">
                    <div class="d-flex flex-column">
                      <ShBodySmall class="neutral-lighten-text">
                        Color personalizado
                      </ShBodySmall>
                      <ShBodySmall class="neutral-text">
                        <!--Cambiar "neutral-text" cuando exista el color gris claro-->
                        Cambiá el color personalizado
                      </ShBodySmall>
                    </div>
                    <div>
                      <v-icon color="neutral base">
                        mdi-chevron-right
                      </v-icon>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between ma-7 align-center">
                    <div class="d-flex flex-column">
                      <ShBodySmall class="neutral-lighten-text">
                        Proyectos
                      </ShBodySmall>
                      <ShBodySmall class="neutral-text">
                        <!--Cambiar "neutral-text" cuando exista el color gris claro-->
                        Mirá los proyectos de tu organización
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
      </v-tab-item>
      <v-tab-item>
        <ShBodySmall class="neutral-text">
          <!--Cambiar "neutral-text" cuando exista el color gris claro-->
          Tablita and stuff
        </ShBodySmall>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
export default {
  data: () => ({
    organization: {
      name: '',
      color: ''
    }
  }),
  async fetch () {
    try {
      const { organizationId } = await this.$userService.getProfile()
      this.organization = await this.$organizationService.getSpecific(organizationId)
    } catch (er) {
      this.$noty.warn('Hubo un error al cargar la información de tu organización')
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Organización')
  }
}
</script>
