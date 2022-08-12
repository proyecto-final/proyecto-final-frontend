<template>
  <ShAsyncDialog
    width="700"
    confirm-text="Guardar"
    cancel-text="Descartar"
    title="Notas"
    :async-confirm-function="save"
    :submit-on-enter="false"
    v-on="$listeners"
    @open="setInitialData"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <v-list-item
          v-on="on"
        >
          <v-list-item-icon>
            <v-icon>
              mdi-note-text
            </v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>
            <ShBody class="neutral-darken-text">
              Agregar una nota
            </ShBody>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <template #default>
      <v-row>
        <v-col>
          <v-card flat outlined>
            <div class="my-3 ml-3">
              <v-div class="d-flex">
                <ShHeading3>
                  Dummy Title
                </ShHeading3>
              </v-div>
              <v-div class="d-flex">
                <ShBody>
                  Esta es una dummy note...
                </ShBody>
              </v-div>
            </div>
            <v-div class="d-flex justify-right mr-4">
              <v-icon>
                mdi-trash-can-outline
              </v-icon>
              <v-icon>
                mdi-square-edit-outline
              </v-icon>
            </v-div>
          </v-card>
        </v-col>
        <v-divider vertical />
        <v-col>
          <div>
            <ShTextArea
              v-model="note"
              placeholder="Escriba su nota..."
              is-note
              flat
              :rules="[$rules.maxLength(70)]"
            />
          </div>
          <div>
            <ShBody neutral>
              {{ user.name }}
            </ShBody>
          </div>
        </v-col>
      </v-row>
    </template>
  </ShAsyncDialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    projectId: {
      type: String,
      required: true
    },
    logId: {
      type: String,
      required: true
    },
    line: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    note: ''
  }),
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    save () {
      this.$logService.updateLine(this.projectId, this.logId, this.line._id, this.note)
    },
    setInitialData () {
      this.note = ''
    }
  }
}
</script>
<style scoped>
.justify-right {
  justify-content: end;
}
</style>
