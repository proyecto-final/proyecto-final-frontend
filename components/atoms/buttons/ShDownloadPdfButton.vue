<template>
  <ShButton
    v-bind="$attrs"
    v-on="$listeners"
    @click="downloadPdf"
  >
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
    <template #default>
      <v-icon>mdi-file-pdf-box</v-icon>
      Descargar
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
    logId: {
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
      this.$timelineService.downloadPdf(this.projectId, this.logId, this.timelineId)
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
          if (msg) { this.$noty.warn(msg.join(', ')) }
        })
    }
  }
}
</script>
