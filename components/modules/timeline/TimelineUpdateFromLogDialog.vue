<template>
  <ShAsyncDialog
    width="600"
    confirm-text="Actualizar"
    title="Actualizar timeline"
    success-text="Timeline actualizado"
    :async-confirm-function="updateFromLog"
    persistent
    v-on="$listeners"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton text :block="$vuetify.breakpoint.smAndDown" v-on="on">
          Actualizar
        </ShButton>
      </slot>
    </template>
    <template #default>
      <ShHeading2 class="d-flex justify-center my-4">
        ¿Estás seguro que deseás actualizar la timeline?
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
    projectId: {
      type: String,
      required: true
    }
  },
  methods: {
    updateFromLog () {
      return this.$timelineService.updateFromLog(this.projectId, this.timelineId)
        .then(() => {
          this.$emit('update')
          return true
        }).catch(() => {
          this.$noty.warn('No es posible actualizar la timeline porque el log asociado ha sido eliminado')
          return false
        })
    }
  }
}
</script>
