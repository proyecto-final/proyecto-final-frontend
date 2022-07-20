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
        <div v-for="(file,index) in logFiles" :key="index" class="px-4">
          <div class="d-flex justify-space-between align-center py-3">
            <div class="d-flex flex-column">
              <ShBody>
                {{ file.name }}
              </ShBody>
              <ShBodySmall neutral>
                {{ file.size }}
              </ShBodySmall>
            </div>
            <div>
              <ShIconButton icon="mdi-close" title="Quitar" @click="remove(file)" />
            </div>
          </div>
          <v-divider v-if="index !== (logFiles.length - 1)" />
        </div>
      </div>
      <v-tabs background-color="transparent">
        <v-tooltip v-for="(log,index) in logFiles" :key="index" bottom>
          <template #activator="{on, attrs}">
            <v-tab v-bind="attrs" v-on="on">
              {{ log.name.length <= 8 ? log.name : log.name.substring(0,8) + "..." }}
            </v-tab>
          </template>
          <span>{{ log.name }}</span>
        </v-tooltip>
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
          uploadedFile.size = this.formatFileSize(file.size, 1)
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
    },
    formatFileSize (bytes, decimalPoint) {
      // decimalPoint is an optional parameter
      if (bytes === 0) { return '0B' }
      const k = 1000
      const dm = decimalPoint || 2
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
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
.v-tab {
text-transform: none !important;
}
</style>
