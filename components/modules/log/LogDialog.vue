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
          :rules="[$rules.required('archivo'), $rules.maxUploadedFiles(5), $rules.maxUploadedFilesSize(50e6)]"
          @change="addLogFile"
        />
        <ShChip
          v-for="(file,index) in logFiles"
          :key="index"
          class="px-4 mr-2 mb-7 mt-2"
          close
          @click:close="remove(file)"
        >
          {{ `${file.name} (${file.size})` }}
        </ShChip>
      </div>
      <v-tabs background-color="transparent">
        <v-tab v-for="(log,index) in logFiles" :key="index">
          {{ `Log - ${index + 1}` }}
        </v-tab>
        <v-tab-item v-for="(log,index) in logFiles" :key="index" class="pb-2">
          <div>
            <ShTextField
              :key="index"
              v-model="log.name"
              label="Nombre *"
              :rules="[$rules.required('nombre')]"
              class="mt-6 mx-2"
            />
          </div>
          <div>
            <ShTextArea
              :key="index"
              v-model="log.description"
              label="Descripción"
              class="mx-2"
            />
          </div>
        </v-tab-item>
      </v-tabs>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  data: () => ({
    logFiles: [],
    filesToAdd: []
  }),
  methods: {
    save () {

    },
    setInitialData () {
      this.filesToAdd = []
      this.logFiles = []
    },
    addLogFile () {
      if (this.validateMaxSize(this.filesToAdd, 50e6) && this.validateMaxNumber(this.filesToAdd, 5)) {
        this.filesToAdd.forEach((file) => {
          const uploadedFile = {
            name: '',
            description: '',
            size: ''
          }
          uploadedFile.name = file.name
          uploadedFile.size = file.size
          this.logFiles.push(uploadedFile)
        })
      }
      this.filesToAdd = []
    },
    remove (file) {
      this.logFiles.splice(this.logFiles.indexOf(file), 1)
      this.filesToAdd.splice(this.logFiles.indexOf(file), 1)
    },
    validateMaxNumber (files, max) {
      return files.length <= max
    },
    validateMaxSize (files, max) {
      return (!files || !files.some(file => file.size > max))
    }
  }
}
</script>
<style scoped>
::v-deep .v-input__slot {
  display: grid;
}

::v-deep .v-input__prepend-inner{
  margin-right: 0px !important;
  display: flex;
  align-self: center;
}
</style>
