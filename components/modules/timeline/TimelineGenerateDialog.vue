<template>
  <ShAsyncDialog
    width="750"
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
        <TimelineSaved
          :project-id="projectId"
          :new-timeline-id="newTimeline._id"
        />
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
    createdTimeline: [],
    newTimeline: null
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
        const [createdTimeline] = await Promise.all([
          this.$timelineService.create(this.projectId, timeline),
          this.$logService.setMarkedLines(this.projectId, logId, [])])
        this.showSuccess = true
        this.newTimeline = createdTimeline
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
