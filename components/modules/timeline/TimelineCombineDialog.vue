<template>
  <ShAsyncDialog
    ref="dialog"
    width="700"
    :confirm-text="buttonText"
    title="Combinar timelines"
    :async-confirm-function="readyToSave ? save : nextTab"
    :submit-on-enter="false"
    :persistent="!showSuccess"
    :hide-primary-button="showSuccess"
    :hide-close-button="showSuccess"
    :hide-secondary-button="showSuccess"
    v-on="$listeners"
    @open="setInitialData"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
          <v-icon color="white">
            mdi-plus
          </v-icon>
          Combinar timelines
        </ShButton>
      </slot>
    </template>
    <template #default>
      <template v-if="showSuccess">
        <TimelineSaved
          :project-id="projectId"
          :new-timeline-id="newTimeline._id"
          @goToTimelines="close"
        />
      </template>
      <template v-else>
        <div class="sh-scrollbar mh-400-px">
          <div class="mr-2">
            <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-4 mt-2">
              <ShBodySmall class="white-text">
                Recordá que podrás combinar las timelines generadas en una <strong>única timeline</strong>.
                De esta manera, las agruparás según sea necesario.
              </ShBodySmall>
            </v-alert>
            <v-row justify="space-between">
              <v-col cols="12" class="mb-2">
                <ShSearchField
                  v-model="filter.title"
                  hide-details
                  clearable
                  placeholder="Buscar por nombre"
                  maxlength="32"
                  @input="search"
                />
              </v-col>
            </v-row>
          </div>
          <v-tabs v-model="selectedTab" background-color="transparent">
            <v-tab>
              Combinar
            </v-tab>
            <v-tab :disabled="!readyToCombine">
              Nombrar
            </v-tab>
            <v-tab-item class="pb-2">
              <div v-if="availableTimelines.length === 0">
                <ShTableEmptyState
                  class="my-10"
                  img-src="/empty-state/timelines.svg"
                >
                  <template #heading>
                    No se encontraron timelines
                  </template>
                  <template #body>
                    No existen timelines con el nombre ingresado<br>
                    o ya se asociaron todas las timelines posibles.
                  </template>
                </ShTableEmptyState>
              </div>
              <div v-else>
                <v-expansion-panels flat padding="0">
                  <v-expansion-panel
                    v-for="(timeline) in availableTimelines"
                    :key="timeline._id"
                  >
                    <v-expansion-panel-header expand-icon="mdi-chevron-down">
                      <div class="d-flex justify-space-between align-center" height="10px">
                        <ShBody strong primary>
                          {{ timeline.title }}
                        </ShBody>
                        <v-checkbox
                          color="primary"
                          class="mb-4"
                          hide-details
                          :value="timeline.isSelected"
                          @click.stop="selectTimeline(timeline)"
                        />
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div>
                        <ShBodySmall strong neutral>
                          {{ timeline.description }}
                        </ShBodySmall>
                      </div>
                      <div>
                        <ShBodySmall class="neutral-lighten-text">
                          Creada el {{ timeline.createdAt | date }}.
                        </ShBodySmall>
                      </div>
                      <div>
                        <ShBodySmall class="neutral-lighten-text">
                          Se analizaron {{ timeline.lines.length }} líneas de log y {{ timeline.lines.map(y => y .ips).flat().length }} direcciones IP,
                          detectando {{ timeline.lines.map(x => x.vulnerabilites).flat().length }} vulnerabilidades.
                        </ShBodySmall>
                      </div>
                      <div>
                        <ShBodySmall class="neutral-lighten-text">
                          Eventos encontrados: {{ Array.from(new Set(timeline.lines.map(y => y.detail.eventId))).join(', ') }}.
                        </ShBodySmall>
                      </div>
                      <div>
                        <ShBodySmall class="neutral-lighten-text">
                          Usuarios hallados: {{ Array.from(new Set(timeline.lines.map(y => y.detail.computer))).join(', ') }}.
                        </ShBodySmall>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-tab-item>
            <v-tab-item class="pb-2">
              <div>
                <ShTextField
                  v-model="timelineHeader.title"
                  class="mt-4 mx-4"
                  label="Título *"
                />
              </div>
              <div>
                <ShTextArea
                  v-model="timelineHeader.description"
                  class="mx-4 mb-4"
                  height="144"
                  label="Descripción"
                />
              </div>
            </v-tab-item>
          </v-tabs>
        </div>
      </template>
    </template>
  </ShAsyncDialog>
</template>
<script>
import { debounce } from 'lodash'
const getEmptyTimelineHeader = () => ({
  title: '',
  description: ''
})
export default {
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    filter: {
      title: ''
    },
    options: {
      page: 1,
      itemsPerPage: 10
    },
    showSuccess: false,
    selectedTab: 0,
    searchedTimelines: [],
    selectedTimelines: [],
    newTimeline: null,
    timelineHeader: getEmptyTimelineHeader(),
    loading: false
  }),
  fetch () {
    this.loading = true
    this.$timelineService.get(this.projectId, {
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.searchedTimelines = result.rows
    }).catch(() => { this.$noty.warn('Hubo un error al cargar los timelines') })
      .finally(() => { this.loading = false })
  },
  computed: {
    readyToCombine () {
      return this.selectedTimelines.length > 1
    },
    buttonText () {
      return this.selectedTab === 0 ? 'Continuar' : 'Combinar'
    },
    readyToSave () {
      return this.selectedTab !== 0
    },
    availableTimelines () {
      const arrayToShow = this.selectedTimelines
      const timelinesToAdd = this.searchedTimelines.filter(aTimeline =>
        !arrayToShow.some(ele => ele._id === aTimeline._id))
      const timelinesToShow = [...arrayToShow, ...timelinesToAdd]
      timelinesToShow.sort(function (timelineA, timelineB) {
        return timelineA._id < timelineB._id ? 1 : -1
      })
      return timelinesToShow
    }
  },
  methods: {
    selectTimeline (timeline) {
      if (this.selectedTimelines.some(aTimeline => aTimeline._id === timeline._id)) {
        this.selectedTimelines = this.selectedTimelines.filter(selectedTimeline => selectedTimeline._id !== timeline._id)
      } else {
        this.selectedTimelines.push({ ...timeline, isSelected: true })
      }
    },
    async save () {
      const allLogs = this.searchedTimelines.map(selectedTimeline => selectedTimeline.logs).flat()
      const allLines = this.searchedTimelines.map(selectedTimeline => selectedTimeline.lines).flat()
        .map(({ line, tags }) => ({ id: line, tags }))
      const uniqueTimelineLogs = Array.from(new Set(allLogs))
      const timeline = {
        ...this.timelineHeader,
        logs: uniqueTimelineLogs,
        lines: allLines
      }
      try {
        this.newTimeline = await this.$timelineService.create(this.projectId, timeline)
        this.showSuccess = true
      } catch (error) {
        const msg = error.response?.data?.msg
        if (msg) { this.$noty.warn(msg.join(', ')) }
      }
      return false
    },
    nextTab () {
      if (this.readyToCombine) {
        this.selectedTab = 1
        this.readyToSave = true
      }
      return Promise.resolve(false)
    },
    setInitialData () {
      this.showSuccess = false
      this.timelineHeader = getEmptyTimelineHeader()
    },
    search () {
      this.loading = true
      this.fetchDebounced()
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    close () {
      this.$refs.dialog.close()
      this.$emit('created')
    }
  }
}
</script>
<style scoped>
::v-deep .v-expansion-panel-header{
  padding: 0%;
}
::v-deep .v-expansion-panel-content__wrap{
  padding: 0%;
}
</style>
