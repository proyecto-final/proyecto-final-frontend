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
        // First page
        this.$emit('switchPage', 0)
        await delay(600)
        const timelineId = this.timelineId
        const linesPage = document.getElementById('v-app-root')
        const doc = new JsPDF('p', 'pt', [linesPage.offsetHeight, linesPage.offsetWidth])
        doc.internal.pageSize.setWidth(linesPage.offsetWidth)
        doc.internal.pageSize.setHeight(linesPage.offsetHeight)
        await this.addScreenshot(doc, linesPage)
        // Second page
        this.$emit('switchPage', 1)
        await delay(600)
        const chartsPage = document.getElementById('v-app-root')
        doc.addPage([chartsPage.offsetWidth, chartsPage.offsetHeight])
        await this.addScreenshot(doc, chartsPage)
        this.$emit('switchPage', 0)
        doc.save(`reporte-timeline-${timelineId}.pdf`)
      } catch {
        this.$noty.warn('Ocurrió un error al descargar la timeline')
      }
    },
    async addScreenshot (doc, element) {
      const canvas = await html2canvas(element)
      const imgData = canvas.toDataURL('image/png')
      doc.addImage(imgData, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight())
    }
  }
}
</script>
