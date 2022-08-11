<template>
  <v-row no-gutters class="border-left">
    <v-col cols="12" md="8" lg="9" class="pt-3">
      <div class="pl-3">
        <v-row>
          <v-col cols="12" lg="8">
            <ShSearchField
              v-model="filter.raw"
              hide-details
              clearable
              placeholder="Buscar por palabra clave"
              maxlength="32"
              @input="fetchDebounced"
            />
          </v-col>
        </v-row>
        <v-row class="mb-6 pr-2">
          <v-col cols="12" md="6" lg="4">
            <ShAutocomplete
              v-model="filter.date"
              hide-details
              clearable
              :items="[{ text: '24/02/2022', value: 'processed' }, { text: '05/11/2021', value: 'processing' }]"
              placeholder="Filtrar por fecha"
            />
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <ShAutocomplete
              v-model="filter.eventId"
              hide-details
              clearable
              :items="[{ text: '4624', value: '4624' }, { text: '24', value: '24' }]"
              placeholder="Filtrar por evento"
            />
          </v-col>
        </v-row>
      </div>
      <div class="border-top bg-white h-100 user-viewport-height-lines sh-scrollbar">
        <v-progress-linear v-if="$fetchState.pending" indeterminate color="primary" />
        <LogLine
          v-for="(line, index) in lines"
          :key="index"
          :line="line"
          :index="index"
          :is-selected="line.isSelected"
          @update:line="updatedLine => setLine(line, updatedLine)"
          @select:line="toggleLine(line)"
        />
        <div v-if="hasMoreLines" v-intersect="getNextLines" class="mt-3 d-flex justify-center">
          <div class="d-flex align-center">
            <v-progress-circular color="primary" indeterminate />
            <div class="mx-2">
              <ShBody>Obteniendo líneas...</ShBody>
            </div>
          </div>
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4" lg="3" class="border-left bg-white pt-3">
      <div class="d-flex justify-center">
        <ShButton>
          Previsualizar timeline
        </ShButton>
      </div>
      <div class="sh-scrollbar user-viewport-height-timeline py-4">
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
                v-for="(line, index) in sortedTimelineLines"
                :key="index"
                color="primary"
                small
              >
                <div>
                  <ShBodySmall>
                    {{ line.index }}: {{ line.raw }}
                  </ShBodySmall>
                </div>
                <div>
                  <ShSpecialLabelSmall neutral>
                    {{ line.timestamp | date }}
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
      </div>
    </v-col>
  </v-row>
</template>
<script>
import { debounce } from 'lodash'
export default {
  data: () => ({
    options: {
      page: 1,
      itemsPerPage: 20
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
      this.lines.push(...result.rows.map((row, index) => ({
        ...row,
        index: index + 1,
        isSelected: !!this.timelineLines.find(line => line._id === row._id)
      })))
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
    },
    hasMoreLines () {
      return this.lines.length < this.serverItemsLength
    },
    sortedTimelineLines () {
      return [...this.timelineLines].sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', `Log - ${this.logId}`)
    this.$store.commit('navigation/CAN_GO_BACK', true)
  },
  methods: {
    fetchDebounced: debounce(function () {
      this.lines = []
      this.options.page = 1
      this.$fetch()
    }, 500),
    toggleLine (line) {
      line.isSelected = !line.isSelected
      if (!line.isSelected) {
        this.timelineLines = this.timelineLines.filter(timelineLine => timelineLine._id !== line._id)
      } else {
        this.timelineLines.push(line)
      }
    },
    setLine (line, updatedLine) {
      Object.assign(line, updatedLine)
    },
    getNextLines (entries) {
      if (entries[0].isIntersecting && !this.loading) {
        this.options.page++
        this.$fetch()
      }
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
.action-button{
  display: none;
}
.user-viewport-height-lines {
  max-height: calc(100vh - 220px);
  min-height: calc(100vh - 220px);
}
.user-viewport-height-timeline {
  max-height: calc(100vh - 116px);
}
::v-deep .v-timeline-item__dot.v-timeline-item__dot--small {
  box-shadow: none !important;
}
</style>
