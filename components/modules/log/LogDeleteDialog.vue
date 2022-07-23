<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Eliminar"
    title="Eliminar log"
    :async-confirm-function="deleteLog"
    :can-confirm="namesMatch"
    v-on="$listeners"
    @open="resetDialog"
  >
    <template #activator="{on}">
      <v-list-item v-on="on">
        <v-list-item-title>
          Eliminar
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #default>
      <div>
        <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
          <ShBodySmall class="white-text">
            Una vez que elimines el log, no se recuperará la información del mismo ni la de sus timelines.
          </ShBodySmall>
        </v-alert>
        <ShBodySmall neutral>
          Para eliminar el log, escribí el nombre: <strong>{{ log.name }}</strong>
        </ShBodySmall>
        <ShTextField
          v-model="logToDeleteName"
          label="Log *"
        />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    log: {
      type: Object,
      required: true
    },
    projectId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    logToDeleteName: ''
  }),
  computed: {
    namesMatch () {
      return this.log.name === this.logToDeleteName
    }
  },
  methods: {
    deleteLog () {
      if (!this.namesMatch) { return }
      return this.$logService
        .deleteLog(this.projectId, this.log.id)
        .then(() => {
          this.$emit('deleted')
          return true
        }).catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        })
    },
    resetDialog () {
      this.logToDeleteName = ''
    }
  }
}
</script>
