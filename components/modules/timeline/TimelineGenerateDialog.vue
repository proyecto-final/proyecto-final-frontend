<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Generar"
    title="Generar timeline"
    :async-confirm-function="save"
    :hide-secondary-button="showSuccess"
    :hide-primary-button="showSuccess"
    :hide-close-button="showSuccess"
    :hide-title="showSuccess"
    v-on="$listeners"
    @open="showSuccess = false"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton class="ma-4" :block="$vuetify.breakpoint.smAndDown" v-on="on">
          Generar timeline
        </ShButton>
      </slot>
    </template>
    <template #default>
      <template v-if="showSuccess">
        <div class="d-flex align-center justify-center my-4">
          <v-icon color="success" size="98px">
            mdi-check-circle
          </v-icon>
        </div>
        <div>
          <ShHeading2 class="d-flex justify-center my-4">
            Tu timeline se generó con correctamente.
          </ShHeading2>
          <ShBody class="d-flex justify-center my-4">
            Para compartirlo, lo descargarás en PDF o bien copiarás el <br>
            link. En caso que quieras editarlo, lo harás desde Timelines.
          </ShBody>
          <div class="d-flex justify-center my-4">
            <ShSecondaryButton class="mx-2" @click="$router.push(`/${projectId}/timelines`)">
              Ir a timelines
            </ShSecondaryButton>
            <ShButton class="mx-2">
              <v-icon>mdi-content-copy</v-icon>
              Copiar link
            </ShButton>
            <ShButton class="mx-2">
              <v-icon>mdi-file-pdf-box</v-icon>
              Descargar
            </ShButton>
          </div>
        </div>
      </template>
      <template v-else>
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
              v-model="title"
              class="mt-4 mx-4"
              label="Título *"
              :rules="[$rules.required('title'), $rules.fieldLength('title', 2, 32)]"
            />
          </v-row>
          <v-row>
            <ShTextArea
              v-model="description"
              class="mx-4 mb-4"
              height="144"
              label="Descripción"
              :rules="[$rules.fieldLength('description', 0, 250)]"
            />
          </v-row>
        </div>
      </template>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    projectId: {
      type: String,
      required: true
    },
    logLines: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    showSuccess: false,
    title: '',
    description: ''
  }),
  methods: {
    save () {
      if (this.showSuccess) {
        return Promise.resolve(true)
      }
      const savePromise = this.$timelineService.create(this.projectId, this.title, this.description, this.logLines)
      return savePromise.catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      }).then((result) => {
        if (result) {
          this.showSuccess = true
        }
        return false
      })
    }
  }
}
</script>
<style scoped>
.no-uppercase {
     text-transform: unset !important;
}
</style>
