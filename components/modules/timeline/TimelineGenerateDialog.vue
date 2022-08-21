<template>
  <ShAsyncDialog
    width="600"
    confirm-text="Generar"
    title="Generar timeline"
    :async-confirm-function="save"
    :hide-secondary-button="showSuccess"
    :hide-primary-button="showSuccess"
    :hide-close-button="showSuccess"
    :hide-title="showSuccess"
    persistent
    v-on="$listeners"
    @open="resetDialog"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton class="ma-4" :block="$vuetify.breakpoint.smAndDown" v-on="on">
          Generar timeline
        </ShButton>
      </slot>
    </template>
    <template #default>
      <template v-if="showSuccess">
        <div class="d-flex align-center justify-center my-4">
          <v-icon color="success" size="500%">
            mdi-check-circle
          </v-icon>
        </div>
        <div>
          <ShHeading2 class="d-flex justify-center my-4">
            Tu timeline se generó con correctamente.
          </ShHeading2>
          <ShBody class="d-flex justify-center my-4">
            Para compartirlo, lo descargarás en PDF o bien copiarás el <br>
            link. En caso que quieras editarlo, lo harás desde Timelines.
          </ShBody>
          <div class="d-flex justify-center my-4">
            <ShSecondaryButton class="mx-2" @click="$router.push(`/${projectId}/timelines`)">
              Ir a timelines
            </ShSecondaryButton>
            <ShButton class="mx-2">
              <v-icon>mdi-content-copy</v-icon>
              Copiar link
            </ShButton>
            <ShDownloadPdfButton
              class="mx-2"
              :project-id="projectId"
              :log-id="logId"
              :timeline-id="timelineId"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
            <ShBodySmall class="white-text">
              Una vez que se genere, lo podrás descargar o copiar su link para que lo vean desde cualquier dispositivo.
            </ShBodySmall>
          </v-alert>
        </div>
        <div>
          <v-row>
            <ShTextField
              v-model="timelineMetadata.title"
              class="mt-4 mx-4"
              label="Título *"
              :rules="[$rules.required('title'), $rules.fieldLength('title', 2, 32)]"
            />
          </v-row>
          <v-row>
            <ShTextArea
              v-model="timelineMetadata.description"
              class="mx-4 mb-4"
              height="144"
              label="Descripción"
              :rules="[$rules.fieldLength('description', 0, 250)]"
            />
          </v-row>
        </div>
      </template>
    </template>
  </ShAsyncDialog>
</template>
<script>
const getEmptyTimelineMetadata = () => ({
  title: '',
  description: ''
})
export default {
  props: {
    projectId: {
      type: String,
      required: true
    },
    logLines: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    showSuccess: false,
    timelineMetadata: getEmptyTimelineMetadata(),
    logId: '',
    timelineId: ''
  }),
  methods: {
    async save () {
      const logId = this.logLines[0].log
      const timeline = {
        ...this.timelineMetadata,
        logs: [logId],
        lines: this.logLines.map(({ _id, tags }) => ({ id: _id, tags }))
      }
      try {
        const createdTimelinePromise = this.$timelineService.create(this.projectId, timeline)
        const savedMarkedLogLinesPromies = this.$logService.saveMarkedLogsLines(this.projectId, timeline.log, [])
        await Promise.all([createdTimelinePromise, savedMarkedLogLinesPromies])
        this.showSuccess = true
        createdTimelinePromise.then(({ log, _id }) => {
          this.logId = log._id
          this.timelineId = _id
        })
      } catch (error) {
        const msg = error.response?.data?.msg
        if (msg) { this.$noty.warn(msg.join(', ')) }
      }
      return false
    },
    resetDialog () {
      this.showSuccess = false
      this.timelineMetadata = getEmptyTimelineMetadata()
    }
  }
}
</script>
