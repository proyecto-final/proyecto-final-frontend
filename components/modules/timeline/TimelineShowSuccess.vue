<template>
  <ShDialog
    v-model="show"
    width="700"
    title="Generar timeline"
    persistent
    v-on="$listeners"
  >
    <template #activator>
      <div>
        <div class="d-flex align-center justify-center my-4">
          <v-icon color="success" size="500%">
            mdi-check-circle
          </v-icon>
        </div>
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
          <ShDownloadPdfButton
            class="mx-2"
            :project-id="projectId"
            :timeline-id="newTimelineId"
          />
          <ShShareButton
            :share-function="getShareLink"
            button-text="Copiar link"
          />
        </div>
      </div>
    </template>
  </ShDialog>
</template>
<script>
export default {
  props: {
    projectId: {
      type: String,
      required: true
    },
    newTimelineId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    show: false
  }),
  methods: {
    getShareLink () {
      return this.$timelineService.createTimelineInvitationToken(this.projectId, this.newTimelineId)
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
    }
  }
}
</script>
