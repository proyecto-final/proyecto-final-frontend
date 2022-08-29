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
          <v-list-item-subtitle>
            <ShBody class="neutral-darken-text">
              {{ `Analizar IP ${isSourceIp ? line.detail.sourceIp : line.detail.destinationIp}` }}
            </ShBody>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <SearchIpCard :ip="ip" class="mt-2 mb-6" />
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
    isSourceIp: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    selectedNote: null,
    notes: [],
    loading: false,
    ip: null
  }),
  mounted () {
    this.loading = true
    if (this.isSourceIp) {
      this.$searchIpService.getIp(this.projectId, this.line.detail.sourceIp).then((result) => {
        this.ip = result
      }).catch(() => {
        this.$noty.warn('Hubo un error al cargar la dirección IP ingresada')
      }).finally(() => {
        this.loading = false
      })
    } else {
      this.$searchIpService.getIp(this.projectId, this.line.detail.destinationIp).then((result) => {
        this.ip = result
      }).catch(() => {
        this.$noty.warn('Hubo un error al cargar la dirección IP ingresada')
      }).finally(() => {
        this.loading = false
      })
    }
  },
  methods: {
    searchIp () {
      this.loading = true
      this.$searchIpService.getIp(this.projectId, this.line.detail.sourceIp).then((result) => {
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
