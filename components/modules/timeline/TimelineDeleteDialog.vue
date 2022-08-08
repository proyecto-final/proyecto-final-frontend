<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Eliminar"
    title="Eliminar timeline"
    :async-confirm-function="deleteTimeline"
    :can-confirm="namesMatch"
    :submit-on-enter="namesMatch"
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
            Una vez que elimines el timeline, no se recuperará la información del mismo.
          </ShBodySmall>
        </v-alert>
        <ShBodySmall neutral>
          Para eliminar el timeline, escribí el nombre: <strong>{{ timeline.title }}</strong>
        </ShBodySmall>
        <ShTextField
          v-model="timelineToDeleteName"
          label="Timeline *"
        />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    timeline: {
      type: Object,
      required: true
    },
    projectId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    timelineToDeleteName: ''
  }),
  computed: {
    namesMatch () {
      return this.timeline.title === this.timelineToDeleteName
    }
  },
  methods: {
    deleteTimeline () {
      if (!this.namesMatch) { return }
      return this.$timelineService
        .deleteTimeline(this.projectId, this.timeline._id)
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
      this.timelineToDeleteName = ''
    }
  }
}
</script>
