<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Guardar"
    title="Editar timeline"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="editTimeline"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <v-list-item
          v-on="on"
        >
          <ShBody>
            Editar
          </ShBody>
        </v-list-item>
      </slot>
    </template>
    <template #default>
      <div class="mr-2 mt-4">
        <div>
          <ShTextField
            v-model="timeline.title"
            label="Nombre *"
            :rules="[$rules.required('nombre'), $rules.maxLength(32)]"
          />
        </div>
        <div>
          <ShTextArea
            v-model="timeline.description"
            label="Descripción"
            :rules="[$rules.maxLength(256)]"
          />
        </div>
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
import { cloneDeep } from 'lodash'
const getEmptyTimeline = () => ({
  name: '',
  description: ''
})
export default {
  props: {
    timeline2Edit: {
      type: Object,
      required: true
    },
    projectId: {
      type: String,
      required: true
    },
    timelineId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    timeline: getEmptyTimeline()
  }),
  methods: {
    save () {
      return this.$timelineService.update(this.projectId, this.timelineId, this.timeline)
        .then(() => {
          this.$emit('updated')
          return true
        })
        .catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        })
    },
    editTimeline () {
      this.timeline = cloneDeep(this.timeline2Edit)
    }
  }
}
</script>
