<template>
  <ShButton
    v-bind="$attrs"
    v-on="$listeners"
    @click="downloadPdf"
  >
    <template #default>
      <v-icon>mdi-file-pdf-box</v-icon>
      Descargar reporte extendido
    </template>
  </ShButton>
</template>
<script>
export default {
  props: {
    projectId: {
      type: String,
      required: true
    },
    timelineId: {
      type: String,
      required: true
    }
  },
  methods: {
    downloadPdf () {
      this.$timelineService.downloadPdf(this.projectId, this.timelineId)
        .then((data) => {
          const downloadLink = document.createElement('a')
          downloadLink.href = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
          downloadLink.download = `${this.timelineId}_${Date.now()}.pdf`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        })
        .catch((error) => {
          const msg = error.response?.data?.msg
          const status = error.response?.status
          if (msg) {
            this.$noty.warn(msg.join(', '))
          } else if (status === 404) {
            this.$noty.warn('No se encontró la timeline')
          } else {
            this.$noty.warn('Ocurrió un error al descargar la timeline')
          }
        })
    }
  }
}
</script>
