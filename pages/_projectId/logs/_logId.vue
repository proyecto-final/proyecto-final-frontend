<template>
  <div>
    <div>
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3">
          <ShSearchField
            v-model="filter.raw"
            hide-details
            clearable
            placeholder="Buscar por palabra clave"
            maxlength="32"
            @input="fetchDebounced"
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
            v-model="filter.date"
            hide-details
            clearable
            :items="[{ text: '24/02/2022', value: 'processed' }, { text: '05/11/2021', value: 'processing' }]"
            placeholder="Filtrar por fecha"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.eventId"
            hide-details
            clearable
            :items="[{ text: '4624', value: '4624' }, { text: '24', value: '24' }]"
            placeholder="Filtrar por evento"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="border-top bg-white h-100 user-viewport-height">
        <v-col cols="7" md="8" lg="9" class="max-height-inherit sh-scrollbar">
          <v-row
            v-for="(line, index) in lines"
            :key="index"
            no-gutters
            class="d-flex log-line"
          >
            <v-col cols="auto" class="clickable" @click="toggleLine(line)">
              <div class="mx-6 my-3 d-flex">
                <v-expand-x-transition>
                  <div v-if="line.isSelected" class="px-1">
                    <v-icon small color="primary">
                      mdi-circle
                    </v-icon>
                  </div>
                </v-expand-x-transition>
                <div v-if="!line.isSelected" class="px-3" />
                <div class="text-align-center">
                  <ShCode>
                    {{ index + 1 }}
                  </ShCode>
                </div>
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
        <v-col class="sh-scrollbar max-height-inherit border-left py-4">
          <div>
            <ShHeading3 class="mx-4">
              Timeline
            </ShHeading3>
          </div>
          <div v-if="timelineLines.length === 0" class="mx-4">
            <ShBody>
              Seleccione alguna línea de log para generar un reporte.
            </ShBody>
          </div>
          <v-expand-transition>
            <div v-if="timelineLines.length !== 0">
              <v-timeline dense clipped-left class="mt-4">
                <v-timeline-item
                  v-for="(line, index) in timelineLines"
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
            </div>
          </v-expand-transition>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
  data: () => ({
    options: {
      page: 1,
      itemsPerPage: 10
    },
    filter: {
      raw: '',
      date: null,
      eventId: null
    },
    lines: [],
    timelineLines: [],
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
      this.lines = result.rows.map(row => ({ ...row, isSelected: false }))
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
  },
  methods: {
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    toggleLine (line) {
      line.isSelected = !line.isSelected
      this.timelineLines = this.lines.filter(l => l.isSelected)
    }
  }
}
</script>
<style scoped lang="scss">
.border-top{
  border-top: 1px solid var(--v-background-base) !important;
}
.border-left{
  border-left: 1px solid var(--v-background-base) !important;
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
.user-viewport-height {
  max-height: calc(100vh - 252px);
  min-height: calc(100vh - 252px);
}
.max-height-inherit {
  max-height: inherit;
}
</style>
