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
      <ShButton v-else text v-on="on">
        Ver Reporte
      </ShButton>
    </template>
    <template #prepend-title="{close}">
      <ShIconButton color="neutral" icon="mdi-close" title="Cerrar" @click="close()" />
    </template>
    <template #close>
      <ShButton v-if="isEditing" class="ma-4" @click="saveExistingTimeline">
        Guardar
      </ShButton>
      <TimelineGenerateDialog v-else-if="!isReadOnly" :project-id="projectId" :log-lines="logLines" />
      <ShButton v-else class="ma-4" @click="redirectToLogPage">
        Editar líneas de log
      </ShButton>
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
          <TimelinePreviewStats
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
    logId: {
      type: String,
      default: ''
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
    existingLines: []
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
  methods: {
    getLinesIfExists () {
      if (this.timelineId && this.isReadOnly) {
        this.$timelineService.getSpecific(this.projectId, this.timelineId).then((result) => {
          this.existingLines = result.lines
        })
      }
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
      this.$router.push(`/${this.projectId}/logs/${this.logId}?timelineId=${this.timelineId}`)
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
