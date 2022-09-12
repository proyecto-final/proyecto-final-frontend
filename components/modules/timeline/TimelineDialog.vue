<template>
  <ShAsyncDialog
    width="700"
    :confirm-text="buttonText"
    title="Combinar timelines"
    :async-confirm-function="readyToSave ? save : nextTab"
    :submit-on-enter="false"
    :hide-secondary-button="showSuccess"
    :hide-primary-button="showSuccess"
    :hide-close-button="showSuccess"
    :hide-title="showSuccess"
    persistent
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
        <TimelineShowSuccess
          :project-id="projectId"
          :new-timeline-id="newTimeline._id"
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
              <v-expansion-panels flat padding="0">
                <v-expansion-panel
                  v-for="(timeline,i) in availableTimelines"
                  :key="i"
                >
                  <v-expansion-panel-header expand-icon="mdi-chevron-down">
                    <div class="d-flex justify-space-between align-center">
                      <ShBody strong neutral>
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
                    <ShBodySmall class="neutral-lighten-text">
                      {{ timeline.description }}
                    </ShBodySmall>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-tab-item>
            <v-tab-item class="pb-2">
              <div>
                <ShTextField
                  v-model="timelineMetadata.title"
                  class="mt-4 mx-4"
                  label="Título *"
                />
              </div>
              <div>
                <ShTextArea
                  v-model="timelineMetadata.description"
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
const getEmptyTimelineMetadata = () => ({
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
      title: '',
      state: null
    },
    options: {
      page: 1,
      itemsPerPage: 2
    },
    showSuccess: false,
    searchedTimelines: [],
    selectedTimelines: [],
    selectedTab: 0,
    createdTimeline: [],
    newTimeline: null,
    timelineMetadata: getEmptyTimelineMetadata(),
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
        !arrayToShow.includes(ele => ele._id === aTimeline._id))
      return arrayToShow.concat(timelinesToAdd)
    }
  },
  methods: {
    selectTimeline (timeline) {
      if (timeline.isSelected) {
        this.searchedTimelines.push({ ...timeline, isSelected: false })
        this.selectedTimelines.pop(aTimeline => aTimeline._id === timeline._id)
      } else {
        this.selectedTimelines.push({ ...timeline, isSelected: true })
        this.searchedTimelines.pop(aTimeline => aTimeline._id === timeline._id)
      }
    },
    async save () {
      const allTimelineLogs = []
      const allTimelineLines = []
      this.selectedTimelines.forEach(selectedTimeline => selectedTimeline.logs.forEach(logId => allTimelineLogs.push(logId)))
      const uniqueTimelineLogs = [...new Set(allTimelineLogs)]
      this.selectedTimelines.forEach(selectedTimeline => selectedTimeline.lines.forEach(line => allTimelineLines.push(line)))
      const timeline = {
        ...this.timelineMetadata,
        logs: uniqueTimelineLogs,
        lines: allTimelineLines.map(({ line, tags }) => ({ id: line, tags }))
      }
      try {
        const [createdTimeline] = await Promise.all([
          this.$timelineService.create(this.projectId, timeline),
          uniqueTimelineLogs.forEach(aLogId => this.$logService.setMarkedLines(this.projectId, aLogId, []))])
        this.showSuccess = true
        this.newTimeline = createdTimeline
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
      this.timelineMetadata = getEmptyTimelineMetadata()
    },
    search () {
      this.loading = true
      this.fetchDebounced()
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
