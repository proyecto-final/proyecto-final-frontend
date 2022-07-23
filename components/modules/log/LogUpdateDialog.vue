<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Guardar"
    title="Editar log"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="editLog"
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
            v-model="log.title"
            label="Nombre *"
            :rules="[$rules.required('nombre')]"
          />
        </div>
        <div>
          <ShTextArea
            v-model="log.description"
            label="Descripción"
          />
        </div>
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
import { cloneDeep } from 'lodash'
const getEmptyLog = () => ({
  name: '',
  description: ''
})
export default {
  props: {
    log2Edit: {
      type: Object,
      required: true
    },
    projectId: {
      type: String,
      required: true
    },
    logId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    log: getEmptyLog()
  }),
  methods: {
    save () {
      return this.$logService.updateLog(this.projectId, this.logId, this.log)
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
    editLog () {
      this.log = cloneDeep(this.log2Edit)
    }
  }
}
</script>
