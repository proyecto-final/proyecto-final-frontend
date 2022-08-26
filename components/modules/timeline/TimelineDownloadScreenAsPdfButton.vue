<template>
  <ShButton
    v-bind="$attrs"
    v-on="$listeners"
    @click="downloadPdf"
  >
    <template #default>
      <v-icon>mdi-chart-box</v-icon>
      Descargar reporte simplificado
    </template>
  </ShButton>
</template>
<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  props: {
    timelineId: {
      type: String,
      required: true
    }
  },
  methods: {
    async downloadPdf () {
      try {
        // eslint-disable-next-line promise/param-names
        const delay = ms => new Promise(res => setTimeout(res, ms))
        const timelineId = this.timelineId
        const element = document.getElementById('v-app-root')
        const doc = new JsPDF('p', 'px', [element.clientHeight / 1.77, element.clientWidth / 1.77])
        await html2canvas(element).then(function (canvas) {
          const imgData = canvas.toDataURL('image/png')
          doc.addImage(imgData, 'PNG', 0, 0)
        })
        this.$emit('switchPage', 1)
        await delay(500)
        const secondElement = document.getElementById('v-app-root')
        doc.addPage('p', 'px', [secondElement.clientHeight / 1.77, secondElement.clientWidth / 1.77])
        await html2canvas(secondElement).then(function (canvas) {
          const imgData = canvas.toDataURL('image/png')
          doc.addImage(imgData, 'PNG', 0, 0)
        })
        doc.save(`reporte-timeline-${timelineId}.pdf`)
        await this.$emit('switchPage', 0)
      } catch {
        this.$noty.warn('Ocurrió un error al descargar la timeline')
      }
    }
  }
}
</script>
