<template>
  <div>
    <div>
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3">
          <ShSearchField
            v-model="keyword"
            hide-details
            clearable
            placeholder="Buscar por palabra clave"
            maxlength="32"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <div class="d-flex justify-end">
            <ShButton>
              Previsualizar timeline
            </ShButton>
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="state"
            hide-details
            clearable
            :items="[{ text: '24/02/2022', value: 'processed' }, { text: '05/11/2021', value: 'processing' }]"
            placeholder="Filtrar por fecha"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="eventId"
            hide-details
            clearable
            :items="[{ text: '4624', value: '4624' }, { text: '24', value: '24' }]"
            placeholder="Filtrar por evento"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="border-top bg-white h-100 max-height-viewport">
        <v-col cols="7" md="8" lg="9" class="border-right max-height-inherit sh-scrollbar">
          <v-row
            v-for="(line, index) in lines"
            :key="index"
            no-gutters
            class="d-flex log-line"
          >
            <v-col cols="auto">
              <div class="mx-6 my-3 text-align-center">
                <ShCode>
                  {{ index + 1 }}
                </ShCode>
              </div>
            </v-col>
            <v-col>
              <div class="d-flex align-center">
                <div class="mr-5 my-3">
                  <ShCode>
                    {{ line.raw }}
                  </ShCode>
                </div>
                <div>
                  <ShChip v-for="detection in line.detections" :key="index + detection" class="mr-2">
                    <v-icon>
                      mdi-link
                    </v-icon>
                    {{ detection }}
                  </ShChip>
                </div>
                <v-menu
                  offset-y
                  close-on-content-click
                >
                  <template #activator="{ on, attrs }">
                    <v-btn
                      class="action-button"
                      v-bind="attrs"
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>
                        mdi-plus
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list nav>
                    <v-list-item>
                      <v-icon>
                        mdi-circle-medium
                      </v-icon>
                      <div class="ml-4">
                        Marcar línea
                      </div>
                    </v-list-item>
                    <v-list-item>
                      <v-icon>
                        mdi-note-text
                      </v-icon>
                      <div class="ml-4">
                        Agregar una nota
                      </div>
                    </v-list-item>
                    <v-list-item>
                      <v-icon>
                        mdi-link
                      </v-icon>
                      <div class="ml-4">
                        Vincular evento
                      </div>
                    </v-list-item>
                    <v-list-item>
                      <v-icon>
                        mdi-shield-search
                      </v-icon>
                      <v-div class="ml-4">
                        Analizar IP
                      </v-div>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="sh-scrollbar max-height-inherit">
          <div>
            <ShHeading3 class="ma-5">
              Timeline
            </ShHeading3>
          </div>
          <v-timeline dense clipped-left class="mt-4">
            <v-timeline-item
              v-for="(line, index) in lines"
              :key="index"
              class="mb-4"
              color="primary"
              small
            >
              <div>
                <ShBodySmall>
                  {{ index + 1 }}: {{ line.raw }}
                </ShBodySmall>
              </div>
              <div>
                <ShSpecialLabelSmall neutral>
                  {{ line.timestamp }}
                </ShSpecialLabelSmall>
              </div>
              <div>
                <ShChip v-for="detection in line.detections" :key="index + detection" class="mt-3 mr-2" small>
                  <v-icon>
                    mdi-link
                  </v-icon>
                  {{ detection }}
                </ShChip>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    options: {
      page: 1,
      itemsPerPage: 10
    },
    filter: {
      raw: ''
    },
    lines: [],
    serverItemsLength: 0,
    loading: false
  }),
  fetch () {
    this.loading = true
    this.$logService.getLines(this.projectId, this.logId, {
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.lines = result.rows
      this.serverItemsLength = result.count
    }).catch(() => {
      this.$noty.warn('Hubo un error al cargar los eventos')
    }).finally(() => {
      this.loading = false
    })
  },
  computed: {
    projectId () {
      return this.$route.params.projectId
    },
    logId () {
      return this.$route.params.logId
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', `Log - ${this.logId}`)
    this.$store.commit('navigation/CAN_GO_BACK', true)
  }
}
</script>
<style scoped lang="scss">
.border-top{
  border-top-style: solid !important;
  border-top-color: var(--v-background-base) !important;
  border-top: 1px;
}
.border-right{
  border-right-style: solid !important;
  border-right-color: var(--v-background-base) !important;
  border-right: 1px;
}
.bg-white {
  background-color: white;
}
.action-button{
  display: none;
}
.log-line:hover {
  background-color: var(--v-background-lighten2) !important;
  & .action-button {
    display: block !important;
  }
}
.max-height-viewport {
  max-height: calc(100vh - 252px);
}
.max-height-inherit {
  max-height: inherit;
}
</style>
