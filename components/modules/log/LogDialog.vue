<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Generar"
    title="Cargar log"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="setInitialData"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
          <v-icon color="white">
            mdi-plus
          </v-icon>
          Cargar log
        </ShButton>
      </slot>
    </template>
    <template #default>
      <div>
        <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-4 mt-2">
          <ShBodySmall class="white-text">
            Podrás subir hasta <strong>5</strong> logs juntos en formato <strong>.evtx o .log</strong>.<br>
            Recordá que el tamaño máximo por archivo es de <strong>50mb</strong>.
          </ShBodySmall>
        </v-alert>
      </div>
      <div>
        <v-file-input
          v-model="filesToAdd"
          multiple
          rounded
          clearable
          clear-icon
          background-color="bg-gray"
          show-size
          height="144"
          placeholder="Arrastrá o agregá tus logs en un formato evtx o log."
          prepend-inner-icon="mdi-plus-circle"
          prepend-icon=""
          type="file"
          accept=".evtx,.log"
          @change="addLogFile"
        />
        <ShChip v-for="(file,index) in logFiles" :key="index" class="px-4 mr-2 mb-9" close>
          {{ `${file.name} (${file.size})` }}
        </ShChip>
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  data: () => ({
    logFiles: [],
    filesToAdd: null
  }),
  methods: {
    save () {

    },
    setInitialData () {
      this.filesToAdd = null
    },
    addLogFile () {
      const uploadedFile = {
        name: '',
        description: '',
        size: ''
      }
      console.log('logFiles Antes', this.logFiles)
      this.filesToAdd.forEach((file) => {
        uploadedFile.name = file.name
        uploadedFile.size = file.size
        this.logFiles.push(uploadedFile)
      })
      console.log('logFiles Despues', this.logFiles)
      // this.logFiles.push(...this.filesToAdd.map(file => ({ ...file, description: '' })))
    }
  }
}
</script>
<style scoped>
::v-deep .v-input__prepend-inner{
  margin-right: 0px !important;
  display: flex;
  align-self: center;
}
</style>
