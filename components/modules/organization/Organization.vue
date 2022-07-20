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
                    <div class="d-flex">
                      <ShBodySmall v-if="projects.length === 0">
                        Sin proyectos vinculados
                      </ShBodySmall>
                      <template v-else>
                        <ShAvatars
                          :avatars-to-show="3"
                          :avatars="projects.map(project => ({
                            text: project.prefix,
                            color: project.color}))"
                        />
                        <v-icon color="neutral">
                          mdi-chevron-right
                        </v-icon>
                      </template>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-tab-item>
      <v-tab-item>
        <v-btn-toggle v-model="tableToShow" mandatory class="mt-4 mb-6">
          <ShButton v-if="tableToShow === 'users'" value="users" text>
            Usuarios
          </ShButton>
          <ShSecondaryButton v-else value="users">
            Usuarios
          </ShSecondaryButton>
          <ShButton v-if="tableToShow === 'projects'" value="projects" text>
            Proyectos
          </ShButton>
          <ShSecondaryButton v-else value="projects" text>
            Proyectos
          </ShSecondaryButton>
        </v-btn-toggle>
        <div v-show="tableToShow === 'users'" class="pb-2">
          <OrganizationUsers :organization-id="organizationId" />
        </div>
        <div v-show="tableToShow === 'projects'">
          <OrganizationProjects :organization-id="organizationId" />
        </div>
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
    },
    filter: {
      name: null,
      date: null
    },
    projects: [],
    tableToShow: 0
  }),
  async fetch () {
    try {
      this.organization = await this.$organizationService.getSpecific(this.organizationId)
      this.projects = (await this.$organizationService.getProjects(this.organizationId, { offset: 0, limit: 100, ...this.filter })).rows
    } catch (er) {
      this.$noty.warn('Hubo un error al cargar la información de tu organización')
    }
  },
  computed: {
    organizationId () {
      return this.$route.params.organizationId
    }
  },
  methods: {
    setOrganization (updatedOrganization) {
      this.organization = updatedOrganization
    }
  }
}
</script>
