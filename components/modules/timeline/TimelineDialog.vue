<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Crear"
    title="Crear timeline"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="setTimeline"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
          <v-icon color="white">
            mdi-plus
          </v-icon>
          Crear timeline
        </ShButton>
      </slot>
    </template>
    <template #default>
      <div>
        <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
          <ShBodySmall class="white-text">
            Una vez que se genere, lo podrás descargar o copiar su link para que lo vean desde cualquier dispositivo.
          </ShBodySmall>
        </v-alert>
      </div>
      <div>
        <v-row>
          <ShTextField
            v-model="timeline.title"
            class="mt-4 mx-4"
            label="Título *"
            :rules="[$rules.required('title'), $rules.fieldLength('title', 2, 32)]"
          />
        </v-row>
        <v-row>
          <ShTextArea
            v-model="timeline.description"
            class="mx-4 mb-4"
            height="144"
            label="Descripción"
            :rules="[$rules.fieldLength('description', 0, 250)]"
          />
        </v-row>
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
const getEmptyTimeline = () => ({
  title: '',
  description: ''
})
export default {
  props: {
    timeline2Edit: {
      type: Object,
      default: null
    },
    projectId: {
      type: String,
      required: true
    },
    timelineId: {
      type: String,
      default: null
    }
  },
  data: () => ({
    timeline: getEmptyTimeline()
  }),
  methods: {
    save () {
      const savePromise = this.$timelineService.saveTimeline(this.projectId, this.timelineId, this.timeline).then((timeline) => {
        this.$emit('created', { ...timeline })
        return true
      })
      return savePromise.catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      })
    },
    setTimeline () {
      this.timeline = getEmptyTimeline()
    }
  }
}
</script>
<style scoped>
.no-uppercase {
     text-transform: unset !important;
}
</style>
