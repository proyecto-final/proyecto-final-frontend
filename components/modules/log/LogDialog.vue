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
      <div class="sh-scrollbar mh-400-px">
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
            v-model="filesToAdd"
            multiple
            rounded
            clearable
            clear-icon
            background-color="bg-gray"
            show-size
            height="144"
            placeholder="Arrastrá o agregá tus logs en formato evtx o log"
            prepend-inner-icon="mdi-plus-circle"
            prepend-icon=""
            type="file"
            accept=".evtx,.log,.csv"
            @change="addLogFile"
          />
          <v-expand-transition>
            <div v-show="error">
              <v-alert type="warning" icon="mdi-alert">
                {{ error }}
              </v-alert>
            </div>
          </v-expand-transition>
          <div v-for="(log,index) in logFiles" :key="index" class="px-4">
            <div class="d-flex justify-space-between align-center py-3">
              <div class="d-flex flex-column">
                <ShBody>
                  {{ truncateTo(log.title, 30) }}
                </ShBody>
                <ShBodySmall neutral>
                  {{ log.size }}
                </ShBodySmall>
              </div>
              <div>
                <ShIconButton icon="mdi-close" title="Quitar" @click="remove(index)" />
              </div>
            </div>
            <v-divider v-if="index !== (logFiles.length - 1)" />
          </div>
        </div>
        <v-tabs background-color="transparent">
          <v-tooltip v-for="(log,index) in logFiles" :key="index" bottom>
            <template #activator="{on, attrs}">
              <v-tab v-bind="attrs" v-on="on">
                {{ truncateTo(log.title, 8) }}
              </v-tab>
            </template>
            <span>{{ log.title }}</span>
          </v-tooltip>
          <v-tab-item v-for="(log,index) in logFiles" :key="index" class="pb-2">
            <div>
              <ShTextField
                :key="index"
                v-model="log.title"
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
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    logFiles: [],
    filesToAdd: []
  }),
  computed: {
    error () {
      return this.logFiles.length > 5
        ? 'Solo puedes subir hasta 5 archivos'
        : this.logFiles.some(file => file.size > 50e6) ? 'Solo puedes subir archivos de hasta 50mb' : ''
    }
  },
  methods: {
    save () {
      if (this.logFiles.length === 0) {
        this.$noty.error('Debes agregar al menos un log')
        return Promise.resolve(false)
      }
      const fileMetadatas = this.logFiles.map(({ title, description }) => ({ title, description }))
      const files = this.logFiles.map(({ file }) => file)
      return this.$logService.save(this.projectId,
        files,
        fileMetadatas)
        .then((log) => {
          this.$emit('created', log)
          return true
        }).catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        })
    },
    setInitialData () {
      this.filesToAdd = []
      this.logFiles = []
    },
    addLogFile () {
      this.logFiles.push(...this.filesToAdd.map(file => ({
        title: file.name,
        description: '',
        size: this.formatFileSize(file.size, 1),
        file
      })))
      this.$nextTick(() => {
        this.filesToAdd = []
      })
    },
    remove (file) {
      this.logFiles.splice(this.logFiles.indexOf(file), 1)
      this.filesToAdd.splice(this.logFiles.indexOf(file), 1)
    },
    formatFileSize (bytes, decimalPoint) {
      // decimalPoint is an optional parameter
      if (bytes === 0) { return '0 B' }
      const k = 1024
      const dm = decimalPoint || 2
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    },
    truncateTo (str, maxLength) {
      return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str
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
::v-deep .v-file-input__text{
 justify-content: center;
}
.v-tab {
text-transform: none !important;
}
</style>
