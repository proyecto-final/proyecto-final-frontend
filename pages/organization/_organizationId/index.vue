<template>
  <div>
    <v-tabs background-color="transparent">
      <v-tab>
        Información
      </v-tab>
      <v-tab>
        Datos
      </v-tab>

      <v-tab-item class="pb-2">
        <div class="d-flex justify-end">
          <ShHeading2 class="neutral-text mt-3 ml-2">
            Información organizacional
          </ShHeading2>
          <v-row justify="end" align="center" class="mt-2">
            <v-col cols="12" sm="10" md="8" lg="7">
              <v-card elevation="1" class="mr-14">
                <v-card-text>
                  <div class="d-flex justify-space-between ma-7">
                    <div>
                      <ShBodySmall class="neutral-text">
                        Nombre de la organización
                      </ShBodySmall>
                    </div>
                    <div>
                      <ShBodySmall class="neutral-text strong-text">
                        {{ organization.name }}
                      </ShBodySmall>
                      <OrganizationChangeNameDialog
                        :organization2-edit="organization"
                        @updated="setOrganization"
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-space-between ma-7 align-center">
                    <div class="d-flex flex-column">
                      <ShBodySmall class="neutral-text">
                        Color personalizado
                      </ShBodySmall>
                      <ShBodySmall class="neutral-lighten-text">
                        Cambiá el color personalizado
                      </ShBodySmall>
                    </div>
                    <div>
                      <v-icon :color="organization.color">
                        mdi-checkbox-blank-circle
                      </v-icon>
                      <OrganizationChangeColorDialog
                        :organization2-edit="organization"
                        @updated="setOrganization"
                      />
                    </div>
                  </div>

                  <div class="d-flex justify-space-between ma-7 align-center">
                    <div class="d-flex flex-column">
                      <ShBodySmall class="neutral-text">
                        Proyectos
                      </ShBodySmall>
                      <ShBodySmall class="neutral-lighten-text">
                        Mirá los proyectos de tu organización
                      </ShBodySmall>
                    </div>
                    <div>
                      <v-icon color="neutral base">
                        mdi-account-hard-hat
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
        <v-tabs background-color="transparent">
          <v-tab>
            Usuarios
          </v-tab>
          <v-tab>
            Proyectos
          </v-tab>
          <v-tab-item class="pb-2">
            <OrganizationUsers :organization-id="organizationId" />
          </v-tab-item>
          <v-tab-item>
            <div class="d-flex ma-7 align-center">
              <ShBodySmall class="neutral-lighten-text">
                Work in progress...
              </ShBodySmall>
              <v-icon color="neutral base">
                mdi-account-hard-hat
              </v-icon>
            </div>
          </v-tab-item>
        </v-tabs>
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
      this.organization = await this.$organizationService.getSpecific(this.organizationId)
    } catch (er) {
      this.$noty.warn('Hubo un error al cargar la información de tu organización')
    }
  },
  computed: {
    organizationId () {
      return this.$route.params.organizationId
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Organización')
  },
  methods: {
    setOrganization (updatedOrganization) {
      this.organization = updatedOrganization
    }
  }
}
</script>
