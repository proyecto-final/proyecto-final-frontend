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
      <div>
        <ShTextField
          :key="index"
          v-model="log.title"
          label="Nombre *"
          :rules="[$rules.required('nombre')]"
          class="mr-4 mt-4"
        />
      </div>
      <div>
        <ShTextArea
          :key="index"
          v-model="log.description"
          label="Descripción"
          class="mr-4"
        />
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
      default: null
    },
    projectId: {
      type: Number,
      default: null
    },
    logId: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    log: getEmptyLog()
  }),
  methods: {
    save () {
      console.log('Project ID: ', this.projectId)
      console.log('Log ID: ', this.logId)
      console.log('Log: ', this.log)
      this.$logService.updateLog(this.projectId, this.logId, this.log)
        .then(() => { this.$emit('updated') })
        .catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
        })
    },
    editLog () {
      this.log = cloneDeep(this.log2Edit)
    }
  }
}
</script>
