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
        <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
          <ShBodySmall class="white-text">
            Podrás subir hasta <strong>5</strong> logs juntos en formato <strong>.evtx o .log</strong>.<br>
            Recordá que el tamaño máximo por archivo es de <strong>50mb</strong>.
          </ShBodySmall>
        </v-alert>
      </div>
      <div>
        <v-file-input
          v-model="fileToAdd"
          chips
          multiple
          rounded
          clear-icon
          background-color="bg-gray"
          show-size
          height="144"
          placeholder="Arrastrá o agregá tus logs en formato evtx o log"
          prepend-inner-icon="mdi-plus-circle"
          prepend-icon=""
          type="file"
          accept=".evtx,.log,.csv"
        />
        <ShChip v-for="(file,index) in logFiles" :key="index" class="px-4 mr-2" close>
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
              v-model="logName"
              label="Nombre *"
              :rules="[$rules.required('título')]"
              class="mt-6 mx-2"
            />
          </div>
          <div>
            <ShTextArea
              v-model="logDescription"
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
  props: {
    organizationId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    logFiles: [
      { name: 'nombre', description: 'descripcion', size: '403kb' },
      { name: 'nombre2', description: 'descripcion2', size: '20mb' }
    ],
    fileToAdd: null
  }),
  methods: {
    save () {

    },
    setInitialData () {
      this.filesToAdd = []
      this.logFiles = []
    },
    addLogFile () {
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
      this.filesToAdd = []
    },
    remove (file) {
      this.logFiles.splice(this.logFiles.indexOf(file), 1)
      this.filesToAdd.splice(this.logFiles.indexOf(file), 1)
    },
    formatFileSize (bytes, decimalPoint) {
      // decimalPoint is an optional parameter
      if (bytes === 0) { return '0 B' }
      const k = 1000
      const dm = decimalPoint || 2
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  }
}
</script>
