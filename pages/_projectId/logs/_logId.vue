<template>
  <v-row no-gutters class="border-left">
    <v-col cols="12" md="7" lg="8" class="pt-3">
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
            <ShDatePicker
              v-model="filter.dates"
              hide-details
              clearable
              range
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
        <v-progress-linear v-if="loading" indeterminate color="primary" />
        <div v-if="lines.length === 0 && !loading" class="ml-5 my-3">
          <ShCode>
            No se hallaron líneas de logs que cumplan con los filtros seleccionados.
          </ShCode>
        </div>
        <div v-else>
          <LogLine
            v-for="(line, index) in lines"
            :key="index"
            :line="line"
            :is-selected="line.isSelected"
            @update:line="updatedLine => setLine(line, updatedLine)"
            @select:line="toggleLine(line)"
          />
        </div>
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
    <v-col cols="12" md="5" lg="4" class="border-left bg-white pt-3">
      <div class="d-flex justify-center">
        <TimelinePreviewDialog
          :log-lines="timelineLines"
          :is-editing="!!timelineId"
          :timeline-id="timelineId"
          @update:logLine="setLogLineTags"
          @update:logLines="setTimelineLines"
        />
      </div>
      <div class="sh-scrollbar user-viewport-height-timeline py-4 pr-2">
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
                small
              >
                <div class="max-lines-2">
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
    lineIds: [],
    filter: {
      raw: '',
      dates: [],
      eventId: null
    },
    lines: [],
    timelineLines: [],
    serverItemsLength: 0,
    loading: false
  }),
  computed: {
    projectId () {
      return this.$route.params.projectId
    },
    timelineId () {
      return this.$route.query.timelineId
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
  watch: {
    'filter.dates': {
      handler (dates) {
        if ([0, 2].includes(dates?.length)) {
          this.fetchDebounced()
        }
      },
      deep: true
    }
  },
  async created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', `Log - ${this.logId}`)
    this.$store.commit('navigation/CAN_GO_BACK', true)
    this.loading = true
    if (this.timelineId) {
      await this.getTimelineLines()
      await this.markLogLines()
    }
    await this.getSelectedLines()
    await this.getLines()
  },
  methods: {
    setLogLineTags ({ logLine, tags }) {
      logLine.tags = tags
    },
    setTimelineLines (timelineLines) {
      this.timelineLines = timelineLines
      this.lines.forEach((line) => {
        line.isSelected = !!this.timelineLines.find(timelineLine => timelineLine._id === line._id)
        line.tags = line.isSelected ? line.tags : []
      })
    },
    fetchDebounced: debounce(function () {
      this.lines = []
      this.options.page = 1
      this.getLines()
    }, 500),
    getSelectedLines () {
      return this.$logService.getLines(this.projectId, this.logId, {
        offset: 0,
        limit: 100,
        isSelected: true
      }).then((result) => {
        this.timelineLines = result.rows.map(line => ({ ...line, tags: [] }))
      })
    },
    getTimelineLines () {
      return this.$timelineService.getSpecific(this.projectId, this.timelineId)
        .then((result) => {
          this.timelineLines = result.lines
        })
    },
    markLogLines () {
      this.lineIds = this.timelineLines.map(lineId => lineId.line)
      return this.$logService.saveMarkedLogsLines(this.projectId, this.logId, this.lineIds)
        .catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
        })
    },
    getLines () {
      const filter = {}
      this.loading = true
      if (this.filter.dates?.length === 2) {
        const smallerDate = this.filter.dates[0] < this.filter.dates[1] ? this.filter.dates[0] : this.filter.dates[1]
        const biggerDate = this.filter.dates[0] > this.filter.dates[1] ? this.filter.dates[0] : this.filter.dates[1]
        filter.dateFrom = smallerDate
        filter.dateTo = biggerDate
      }
      return this.$logService.getLines(this.projectId, this.logId, {
        offset: (this.options.page - 1) * this.options.itemsPerPage,
        limit: this.options.itemsPerPage,
        raw: this.filter.raw,
        ...filter
      }).then((result) => {
        this.lines.push(...result.rows.map(line => ({ ...line, tags: [] })))
        this.serverItemsLength = result.count
      }).catch(() => {
        this.$noty.warn('Hubo un error al cargar los eventos')
      }).finally(() => {
        this.loading = false
      })
    },
    toggleLine (line) {
      line.isSelected = !line.isSelected
      this.$logService.updateLine(this.projectId, this.logId, line._id, { isSelected: line.isSelected })
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
        this.getLines()
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
