<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Guardar"
    title="Analizar IP"
    hide-secondary-button
    :async-confirm-function="save"
    :submit-on-enter="false"
    v-on="$listeners"
    @open="setInitialData"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <v-list-item
          v-on="on"
        >
          <v-list-item-icon>
            <v-icon>
              mdi-shield-search
            </v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle @click="searchIp(ipRaw)">
            <ShBody class="neutral-darken-text">
              {{ `Analizar IP ${ipRaw}` }}
            </ShBody>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <v-skeleton-loader
      v-if="loading"
      type="image"
      class="mb-6 border-image"
    />
    <SearchIpCard v-else :ip="ip" class="mt-2 mb-6" />
  </ShAsyncDialog>
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
    line: {
      type: Object,
      required: true
    },
    ipRaw: {
      type: String,
      required: true
    }
  },
  data: () => ({
    selectedNote: null,
    notes: [],
    ip: {},
    loading: true
  }),
  methods: {
    searchIp (ipToSearch) {
      this.$searchIpService.getIpFromLine(this.projectId, this.logId, this.line._id, ipToSearch)
        .then((result) => {
          this.ip = result
        }).catch(() => {
          this.$noty.warn('Hubo un error al cargar la dirección IP ingresada')
        }).finally(() => {
          this.loading = false
        })
    },
    async save () {
      try {
        this.notes = this.notes.filter(note => note.text.trim().length !== 0)
        const notes = this.notes.map(note => note.text)
        this.$emit('update:line', { ...this.line, notes })
        const updatedLine = await this.$logService.updateLine(this.projectId, this.logId, this.line._id, { notes })
        this.$emit('updated', updatedLine)
        return true
      } catch (error) {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      }
    },
    setInitialData () {
      this.notes = this.line.notes.map(note => ({ text: note }))
      this.selectedNote = this.notes[0]
    }
  }
}
</script>
<style scoped>
::v-deep .v-skeleton-loader__image{
  border-radius: 16px !important;
}
</style>
