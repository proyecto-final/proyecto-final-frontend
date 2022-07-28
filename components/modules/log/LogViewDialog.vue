<template>
  <ShAsyncDialog
    title="LOG"
    hide-primary-button
    hide-secondary-button
    fullscreen
    transition="dialog-bottom-transition"
    :async-confirm-function="save"
    class="no-rounded"
    v-on="$listeners"
    @open="setInitialData"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
          Ver log
        </ShButton>
      </slot>
    </template>
    <template #default>
      <div class="mb-6">
        <v-row justify="space-between">
          <v-col cols="12" md="4" lg="3">
            <ShSearchField
              hide-details
              clearable
              placeholder="Buscar por palabra clave"
            />
          </v-col>
          <v-col cols="12" md="4" lg="3">
            <div class="d-flex justify-end">
              <ShButton>
                Previsualizar Timeline
              </ShButton>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="3">
            <ShAutocomplete
              placeholder="Filtrar por fecha"
            />
          </v-col>
          <v-col cols="12" md="4" lg="3">
            <ShAutocomplete
              placeholder="Filtrar por evento"
            />
          </v-col>
        </v-row>
      </div>
      <div>
        <v-card outlined color="red">
          <v-row class="ma-7">
            Linea 1 - Soy una linea de log
          </v-row>
          <v-row class="ma-7">
            Linea 2 - Soy una linea de log
          </v-row>
          <v-row class="ma-7">
            Linea 3 - Soy una linea de log
          </v-row>
          <v-row class="ma-7">
            Linea 4 - Soy una linea de log
          </v-row>
        </v-card>
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
  methods: {
    save () {

    }
  }
}
</script>
