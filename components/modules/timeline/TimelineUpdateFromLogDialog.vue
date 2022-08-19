<template>
  <ShAsyncDialog
    width="600"
    confirm-text="Actualizar"
    title="Actualizar timeline"
    :async-confirm-function="updateFromLog"
    persistent
    v-on="$listeners"
    @open="resetDialog"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton class="ma-2" text :block="$vuetify.breakpoint.smAndDown" v-on="on">
          Actualizar
        </ShButton>
      </slot>
    </template>
    <template #default>
      <ShHeading2 class="d-flex justify-center my-4">
        ¿Esta seguro que desea actualizar la timeline?
      </ShHeading2>
      <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
        <ShBodySmall class="white-text">
          Al actualizar la timeline todos los datos actuales serán reemplazados por los que se encuentran en el log asociado a la misma.
        </ShBodySmall>
      </v-alert>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    timelineId: {
      type: String,
      required: true
    },
    logId: {
      type: String,
      required: true
    },
    projectId: {
      type: String,
      required: true
    }
  },
  methods: {
    updateFromLog () {
      this.$logService.getLines(this.projectId, this.logId, {
        offset: 0,
        limit: 100,
        isSelected: true
      }).then((result) => {
        const timeline = {
          log: this.logId,
          lines: result.map(({ _id, tags }) => ({ id: _id, tags }))
        }
        this.$timelineService.update(this.projectId, this.timelineId, timeline)
          .then((response) => {
            this.$emit('updated', response)
          })
          .catch((error) => {
            const msg = error.response?.data?.msg
            if (msg) {
              this.$noty.warn(msg.join(', '))
            }
          })
      })
    }
  }
}
</script>
