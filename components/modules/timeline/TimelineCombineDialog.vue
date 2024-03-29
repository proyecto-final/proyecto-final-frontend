<template>
  <ShAsyncDialog
    ref="dialog"
    width="700"
    :confirm-text="readyToSave ? 'Combinar' : 'Continuar'"
    title="Combinar timelines"
    :async-confirm-function="saveFunction"
    :submit-on-enter="false"
    :skip-validation="!readyToSave"
    persistent
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
        <div class="sh-scrollbar mh-600-px">
          <div class="mr-2">
            <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-4 mt-2">
              <ShBodySmall class="white-text">
                Recordá que podrás combinar las timelines generadas en una <strong>única timeline</strong>.
                De esta manera, las agruparás según sea necesario.
              </ShBodySmall>
            </v-alert>
            <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-4 mt-2">
              <ShBodySmall class="white-text">
                Solamente se tendrán en cuenta aquellas líneas que sigan existiendo, es decir, que su log no haya sido eliminado.
              </ShBodySmall>
            </v-alert>
            <v-row justify="space-between">
              <v-col cols="12" class="mb-2">
                <ShSearchField
                  v-model="filter.title"
                  hide-details
                  clearable
                  :loading="loading"
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
              <div v-if="availableTimelines.length === 0 && !filter.title">
                <ShTableEmptyState
                  class="my-10"
                  img-src="/empty-state/timelines.svg"
                >
                  <template #heading>
                    No se encontraron timelines
                  </template>
                  <template #body>
                    No existen timelines con el nombre ingresado.
                  </template>
                </ShTableEmptyState>
              </div>
              <div v-else>
                <v-expansion-panels flat padding="0">
                  <v-expansion-panel
                    v-for="(timeline) in availableTimelines"
                    :key="timeline._id"
                  >
                    <v-expansion-panel-header expand-icon="mdi-chevron-down" class="pa-0">
                      <div class="d-flex justify-space-between align-center" height="10px">
                        <ShBody strong primary>
                          {{ timeline.title }}
                        </ShBody>
                        <v-icon v-if="timeline.isSelected" color="primary" @click.stop="selectTimeline(timeline)">
                          mdi-checkbox-marked
                        </v-icon>
                        <v-icon v-else color="primary" @click.stop="selectTimeline(timeline)">
                          mdi-checkbox-blank-outline
                        </v-icon>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div>
                        <ShBodySmall strong neutral>
                          {{ timeline.description }}
                        </ShBodySmall>
                      </div>
                      <div>
                        <ShBodySmall neutral>
                          Creada el {{ timeline.createdAt | date }}.
                        </ShBodySmall>
                      </div>
                      <div>
                        <ShChip class="my-2">
                          Líneas de log analizadas: {{ timeline.lines.length }}
                        </ShChip>
                        <ShChip class="my-2">
                          Direcciones IPs consultadas: {{ timeline.lines.map(line => line.ips).flat().length }}
                        </ShChip>
                        <ShChip color="vulnerability" class="my-2">
                          Vulnerabilidades detectadas: {{ timeline.lines.map(line => line.vulnerabilites).flat().length }}
                        </ShChip>
                      </div>
                      <div class="my-2">
                        <ShShowMoreLessText
                          :text=" getEvents(timeline) || 'No existen eventos asociados.'"
                          :characters-to-show="70"
                        />
                      </div>
                      <div class="my-2">
                        <ShShowMoreLessText
                          :text=" getUsers(timeline) || 'No existen usuarios asociados.'"
                          :characters-to-show="70"
                        />
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
                  :rules="[$rules.required('title'), $rules.fieldLength('title', 2, 32)]"
                />
              </div>
              <div>
                <ShTextArea
                  v-model="timelineHeader.description"
                  class="mx-4 mb-4"
                  height="144"
                  label="Descripción"
                  :rules="[$rules.fieldLength('description', 0, 250)]"
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
import EventTranslation from '@/services/helpers/mixins/EventTranslation'
const getEmptyTimelineHeader = () => ({
  title: '',
  description: ''
})
export default {
  mixins: [EventTranslation],
  props: {
    projectId: {
      type: String,
      required: true
    },
    updatedTimelines: {
      type: Array,
      default: () => []
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
      this.searchedTimelines = result.rows.map(timeline => ({
        ...timeline,
        isSelected: this.selectedTimelines.some(selectedTimeline => selectedTimeline._id === timeline._id)
      }))
    }).catch(() => { this.$noty.warn('Hubo un error al cargar los timelines') })
      .finally(() => { this.loading = false })
  },
  computed: {
    readyToCombine () {
      return this.selectedTimelines.length > 1
    },
    readyToSave () {
      return this.selectedTab !== 0
    },
    saveFunction () {
      return this.readyToSave ? this.save : this.nextTab
    },
    availableTimelines () {
      const selectedTimelines = this.selectedTimelines
      const timelinesToAdd = this.updatedTimelines.filter(aTimeline =>
        !selectedTimelines.some(ele => ele._id === aTimeline._id))
      const searchedTimelinesToAdd = this.searchedTimelines.filter(aTimeline =>
        !timelinesToAdd.some(ele => ele._id === aTimeline._id) && !selectedTimelines.some(ele => ele._id === aTimeline._id))
      const timelinesToShow = [...selectedTimelines, ...timelinesToAdd, ...searchedTimelinesToAdd]
      timelinesToShow.sort(function (timelineA, timelineB) {
        return timelineA._id < timelineB._id ? 1 : -1
      })
      return timelinesToShow
        .filter(timeline => !this.filter.title || timeline.title.toLowerCase().includes(this.filter.title.toLowerCase()))
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
      const allLogs = this.selectedTimelines.map(selectedTimeline => selectedTimeline.logs).flat()
      const allLines = this.selectedTimelines.map(selectedTimeline => selectedTimeline.lines).flat()
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
      } else {
        this.$noty.warn('Debe seleccionar al menos dos timelines para combinar')
      }
      return Promise.resolve(false)
    },
    setInitialData () {
      this.showSuccess = false
      this.selectedTab = 0
      this.selectedTimelines = []
      this.timelineHeader = getEmptyTimelineHeader()
      this.filter.title = ''
      this.$fetch()
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
    },
    getEvents (timeline) {
      const events = timeline.lines.map(line => line.detail.eventId)
      return this.haveAllUndefinedItems(events)
        ? ''
        : `Eventos encontrados: ${Array.from(new Set(timeline.lines
        .map(line => `${this.getEventById(line.detail.eventId).description || 'Sin identificar'} (${line.detail.eventId})`)))
        .join(', ')}.`
    },
    getUsers (timeline) {
      const users = timeline.lines.map(line => line.detail.computer)
      return this.haveAllUndefinedItems(users)
        ? ''
        : `Usuarios hallados: ${Array.from(new Set(users))
        .join(', ')}.`
    },
    haveAllUndefinedItems (events) {
      return events.every(item => item === undefined)
    }
  }
}
</script>
<style scoped>
::v-deep .v-expansion-panel-content__wrap{
  padding: 0% !important;
}
</style>
