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
            <div class="my-3 ml-3 d-flex justify-space-between">
              <v-div>
                <ShBody neutral>
                  Esta es una dummy note...
                </ShBody>
              </v-div>
              <v-div class="mr-3">
                <v-tooltip bottom>
                  <template #activator="{on}">
                    <v-icon v-on="on">
                      mdi-trash-can-outline
                    </v-icon>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{on}">
                    <v-icon v-on="on">
                      mdi-square-edit-outline
                    </v-icon>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
              </v-div>
            </div>
          </v-card>
          <v-div class="d-flex justify-center">
            <v-icon class="mt-5">
              mdi-dots-vertical
            </v-icon>
          </v-div>
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
.justify-center {
  justify-content: center;
}
.v-card.v-sheet.theme--light {
  border-radius: 12px !important;
  background: var(--v-note1Bg-base) !important;
}
</style>
