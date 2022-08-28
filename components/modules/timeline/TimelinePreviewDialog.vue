<template>
  <ShDialog
    v-model="open"
    width="500"
    confirm-text="Previsualizar"
    title="Previsualización del timeline"
    fullscreen
    hide-secondary-button
    card-class="bg-default"
    v-on="$listeners"
  >
    <template #activator="{on}">
      <ShButton v-if="!isReadOnly" :disabled="logLines.length == 0" :block="$vuetify.breakpoint.smAndDown" v-on="on">
        Previsualizar timeline
      </ShButton>
      <div v-else class="d-flex">
        <ShButton text v-on="on">
          Ver Reporte
        </ShButton>
        <ShShareButton
          :share-function="getShareLink"
          button-text="Copiar link"
        />
      </div>
    </template>
    <template #prepend-title="{close}">
      <ShIconButton color="neutral" icon="mdi-close" title="Cerrar" @click="close()" />
    </template>
    <template #close>
      <ShButton v-if="isEditing" class="ma-4" @click="saveExistingTimeline">
        Guardar
      </ShButton>
      <TimelineGenerateDialog v-else-if="!isReadOnly" :project-id="projectId" :log-lines="logLines" />
      <v-menu
        v-else
        bottom
        transition="scale-transition"
        offset-y
        nudge-bottom="10"
      >
        <template #activator="{on}">
          <span class="pt-2 mr-8" v-on="on">
            <ShButton small>
              Opciones
              <v-icon>
                mdi-chevron-down
              </v-icon>
            </ShButton>
          </span>
        </template>
        <template #default>
          <v-card class="d-flex flex-column pa-2">
            <TimelineUpdateFromLogDialog
              :project-id="projectId"
              :timeline-id="timelineId"
              @update="getLinesIfExists"
            />
            <ShButton class="my-4" @click="redirectToLogPage">
              <v-icon>mdi-pencil</v-icon>
              Editar líneas de log
            </ShButton>
            <ShDownloadPdfButton
              :project-id="projectId"
              :timeline-id="timelineId"
              class="mb-4"
            />
            <TimelineDownloadScreenAsPdfButton v-if="open" :timeline-id="timelineId" @switchPage="page => selectedTab = page" />
          </v-card>
        </template>
      </v-menu>
    </template>
    <template #default>
      <v-row justify="center" no-gutters>
        <v-col cols="8">
          <div>
            <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
              <ShBodySmall class="white-text">
                Recordá que el reporte incluye las líneas de código resaltadas y los eventos vinculados.<br>
                Las notas agregadas y análisis de IP son privados.
              </ShBodySmall>
            </v-alert>
          </div>
          <v-tabs background-color="transparent">
            <v-tab>
              Análisis
            </v-tab>
            <v-tab>
              Estadísticas
            </v-tab>
            <v-tab-item class="pb-2">
              <div class="my-4">
                <ShChip class="mx-1" @click="selectAll">
                  <v-icon v-if="isSelectedAll">
                    mdi-check
                  </v-icon>
                  Todos
                </ShChip>
                <ShChip v-for="(tag, index) in distinctTags" :key="index" class="mx-1" @click="selectTag(tag)">
                  <v-icon v-if="tag.isSelected">
                    mdi-check
                  </v-icon>
                  {{ tag.tag }}
                </ShChip>
              </div>
              <v-row>
                <v-col cols="8">
                  <v-timeline v-for="(logLine, index) in showableLogLines" :key="index" dense clipped-left>
                    <v-timeline-item small color="primary">
                      <div class="d-flex align-center">
                        <div>
                          <ShBody strong class="mb-4">
                            {{ logLine.raw }}
                          </ShBody>
                          <div>
                            <ShChip
                              v-for="(vulnerability, vulnerabilityIndex) in logLine.vulnerabilites"
                              :key="`${index}-${vulnerabilityIndex}`"
                              class="mb-2 mx-1"
                              color="vulnerability"
                            >
                              <v-icon>
                                mdi-link
                              </v-icon>
                              {{ vulnerability.name }}
                            </ShChip>
                          </div>
                          <ShChip v-for="(tag, tagIndex) in logLine.tags" :key="`${index}-${tagIndex}`" class="mb-2 mx-1">
                            {{ tag }}
                          </ShChip>
                          <v-menu offset-y :close-on-content-click="false" @input="resetTag">
                            <template #activator="{ on, attrs }">
                              <span
                                v-bind="attrs"
                                v-on="on"
                              >
                                <ShIconButton
                                  v-if="!isReadOnly"
                                  class="mb-2"
                                  color="neutral"
                                  icon="mdi-tag-plus"
                                  title="Agregar tag"
                                />
                              </span>
                            </template>
                            <template #default>
                              <v-form @submit.prevent="addTag(logLine)">
                                <ShTextField
                                  v-model="newTag"
                                  hide-details
                                  label="Tag *"
                                />
                              </v-form>
                            </template>
                          </v-menu>
                          <div>
                            <ShBody neutral>
                              {{ logLine.timestamp | date }}
                            </ShBody>
                          </div>
                        </div>
                        <div v-if="!isReadOnly" class="ml-2">
                          <ShIconButton
                            class="d-flex align-center"
                            color="red"
                            icon="mdi-delete"
                            title="Borrar"
                            @click="removeLine(logLine)"
                          />
                        </div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-col>
                <v-col cols="4">
                  <v-card v-if="isReadOnly" color="note1Bg" flat class="mx-2">
                    <v-card-text>
                      <ShHeading2 neutral>
                        Descripción
                      </ShHeading2>
                      <br>
                      <ShBodySmall>
                        {{ timelineDescription === '' ? 'El timeline no posee descripción' : timelineDescription }}
                      </ShBodySmall>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-card color="analizedLines lighten-1" elevation="0" class="mt-3 w-100">
                    <v-card-text>
                      <div>
                        <v-icon color="analizedLines" class="mt-3 mb-4 mx-4">
                          mdi-code-tags
                        </v-icon>
                      </div>
                      <div>
                        <ShHeading1 class="mb-4 mx-4">
                          {{ logLinesCount }}
                        </ShHeading1>
                      </div>
                      <div>
                        <ShBodySmall neutral class="mb-4 mx-4">
                          Líneas de log analizadas
                        </ShBodySmall>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card color="analizedEvents lighten-1" elevation="0" class="mt-3 w-100">
                    <v-card-text>
                      <div>
                        <v-icon color="analizedEvents" class="mt-3 mb-4 mx-4">
                          mdi-bug
                        </v-icon>
                      </div>
                      <div>
                        <ShHeading1 class="mb-4 mx-4">
                          {{ detectedEvents }}
                        </ShHeading1>
                      </div>
                      <div>
                        <ShBodySmall neutral class="mb-4 mx-4">
                          Vulnerabilidades analizadas
                        </ShBodySmall>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <TimelineCharts :log-lines="lines2Show" />
              <v-row>
                <v-col>
                  <v-card v-if="detectedEvents > 0" elevation="0" class="w-100">
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center my-4">
                        <ShHeading2 class="mt-3 mb-4">
                          Vulnerabilidades analizadas
                        </ShHeading2>
                        <ShBodySmall neutral>
                          Usuario VS Sherlock
                        </ShBodySmall>
                      </div>
                      <v-row>
                        <v-col class="d-flex justify-content-start">
                          <div class="mr-10">
                            <div>
                              <ShBodySmall strong>
                                {{ detectedEvents }}
                              </ShBodySmall>
                            </div>
                            <div>
                              <ShBodySmall neutral>
                                Total
                              </ShBodySmall>
                            </div>
                          </div>
                          <div class="mx-10">
                            <div>
                              <ShBodySmall strong>
                                {{ userDetectedEvents }}
                              </ShBodySmall>
                            </div>
                            <div>
                              <ShBodySmall neutral>
                                Usuario
                              </ShBodySmall>
                            </div>
                          </div>
                          <div class="mx-10">
                            <div>
                              <ShBodySmall strong>
                                {{ systemDetectedEvents }}
                              </ShBodySmall>
                            </div>
                            <div>
                              <ShBodySmall neutral>
                                Sherlock
                              </ShBodySmall>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                      <div class="my-4">
                        <v-progress-linear
                          rounded
                          height="17"
                          background-color="sherlockDetectedEvents"
                          color="userDetectedEvents"
                          :value="userDetectedEventsPercentage"
                        />
                      </div>
                      <div class="d-flex justify-center">
                        <div>
                          <v-icon color="userDetectedEvents">
                            mdi-circle
                          </v-icon>
                          <ShBodySmall neutral class="mx-3">
                            Usuario
                          </ShBodySmall>
                          <v-icon color="sherlockDetectedEvents">
                            mdi-circle
                          </v-icon>
                          <ShBodySmall neutral class="mx-3">
                            Sherlock
                          </ShBodySmall>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs>
        <v-col :id="open ? 'v-app-root' : ''" cols="8">
          <TimelinePreviewStats
            :tab.sync="selectedTab"
            :lines2-show="lines2Show"
            :is-read-only="isReadOnly"
            :timeline-description="timelineDescription"
            :log-lines-count="logLinesCount"
            :vulnerabilites="vulnerabilites"
            @addTagInALine="addTagInALine"
            @updateLogLines="updateLogLines"
            @closeDialog="closeDialog"
          />
        </v-col>
      </v-row>
    </template>
  </ShDialog>
</template>
<script>
export default {
  props: {
    logLines: {
      type: Array,
      required: true
    },
    timeline: {
      type: Object,
      default: null
    },
    timelineId: {
      type: String,
      default: ''
    },
    timelineDescription: {
      type: String,
      default: ''
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    open: false,
    isSelectedAll: true,
    existingLines: [],
    selectedTab: 0
  }),
  computed: {
    lines2Show () {
      return this.timelineId && !this.isEditing ? this.existingLines : this.logLines
    },
    vulnerabilites () {
      return this.lines2Show.map(line => line.vulnerabilites).flat()
    },
    logLinesCount () {
      return this.lines2Show.length
    },
    projectId () {
      return this.$route.params.projectId
    }
  },
  watch: {
    open (value) {
      if (value) {
        this.getLinesIfExists()
      }
    }
  },
  mounted () {
    const differentTags = new Set(this.logLines.map(line => line.tags).flat())
    this.distinctTags = Array.from(differentTags).map(tag => ({ tag, isSelected: false }))
  },
  methods: {
    getLinesIfExists () {
      if (this.timelineId && this.isReadOnly) {
        this.$timelineService.getSpecific(this.projectId, this.timelineId).then((result) => {
          this.existingLines = result.lines
        })
      }
    },
    getShareLink () {
      return this.$timelineService.createTimelineInvitationToken(this.projectId, this.timelineId)
        .then((response) => {
          const URLToCopy = `${window.location.origin}/report/${response.token}`
          navigator.clipboard.writeText(URLToCopy)
          this.$noty.success('Se ha copiado el link para compartir la timeline en el portapapeles')
        }).catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
        })
    },
    updateLogLines ({ remainingLines }) {
      this.$emit('update:logLines', remainingLines)
    },
    closeDialog () {
      this.open = false
    },
    addTagInALine ({ logLine, newTag }) {
      this.$emit('update:logLine', {
        logLine,
        tags: [...logLine.tags, newTag]
      })
    },
    redirectToLogPage () {
      const logId = this.timeline.logs[0]
      this.$logService.getLines(this.projectId, logId, {
        offset: 0,
        limit: 1
      }).then(() => {
        this.$router.push(`/${this.projectId}/logs/${logId}?timelineId=${this.timelineId}`)
      }).catch(() => {
        this.$noty.warn('Imposible editar la timeline, el log de esta timeline ha sido eliminado')
      })
    },
    redirectToTimelinePage () {
      this.$router.push(`/${this.projectId}/timelines`)
    },
    saveExistingTimeline () {
      const timeline = { lines: this.lines2Show }
      if (this.isEditing && this.timelineId) {
        timeline.lines = this.lines2Show.map(({ _id, tags }) => ({ line: _id, tags }))
      }
      return this.$timelineService.update(this.projectId, this.timelineId, timeline)
        .then((timeline) => {
          this.$emit('updated', timeline)
          this.redirectToTimelinePage()
          return true
        })
        .catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        })
    }
  }
}
</script>
