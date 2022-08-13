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
        <v-col v-if="notes.length > 0" class="h-100 user-viewport-height-note sh-scrollbar">
          <v-card
            v-for="(note,index) in notes"
            :key="index"
            :class="`mb-3 ${isEditing ? 'selected' : 'default'}`"
            flat
            outlined
          >
            <div class="ml-2 d-flex justify-space-between">
              <div>
                <ShBody neutral>
                  {{ cutTo(note, 23) }}
                </ShBody>
              </div>
              <div>
                <ShIconButton
                  icon="mdi-trash-can-outline"
                  title="Eliminar"
                  v-on="on"
                  @click="removeNote(index)"
                />
                <ShIconButton
                  icon="mdi-square-edit-outline"
                  title="Editar"
                  v-on="on"
                  @click="editNote(index)"
                />
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col v-else>
          <ShHeading3 neutral class="d-flex justify-center align-center">
            No existen notas...
          </ShHeading3>
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
          <div class="d-flex justify-right mb-7">
            <v-btn
              v-if="isEditing"
              text
              color="neutral"
              small
              :ripple="false"
              class="btn-no-bg no-uppercase"
              @click="cancelEdit"
            >
              <v-icon x-small>
                mdi-trash-can
              </v-icon>
              Descartar cambios
            </v-btn>
            <v-btn
              v-if="isEditing"
              text
              color="neutral"
              small
              :ripple="false"
              class="btn-no-bg no-uppercase"
              @click="saveEdit"
            >
              <v-icon x-small>
                mdi-plus-circle
              </v-icon>
              Guardar cambios
            </v-btn>
            <v-btn
              v-else
              text
              color="neutral"
              small
              :ripple="false"
              class="btn-no-bg no-uppercase"
              @click="addNote"
            >
              <v-icon x-small>
                mdi-plus-circle
              </v-icon>
              Agregar nota
            </v-btn>
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
    note: '',
    notes: ['Esta es una dummy note...', 'Esta es otra dummy note...'],
    isEditing: false,
    editingIndex: null
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
    },
    addNote () {
      this.notes.push(this.note)
      this.note = ''
    },
    saveEdit () {
      this.notes[this.editingIndex] = this.note
      this.editingIndex = null
      this.isEditing = false
    },
    cancelEdit () {
      this.editingIndex = null
      this.isEditing = false
      this.note = ''
    },
    removeNote (noteIndex) {
      this.notes.splice(noteIndex, 1)
    },
    editNote (noteIndex) {
      this.note = this.notes[noteIndex]
      this.editingIndex = noteIndex
      this.isEditing = true
    },
    cutTo (str, length) {
      return str.length > length ? `${str.substr(0, length - 3)}...` : str
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
.align-center {
  align-items: center;
}
.selected {
  background-color: var(--v-note1Bg-base);
}
.default {
  background-color: #DFE2F5;
}
.v-card.v-sheet.theme--light {
  border-radius: 12px !important;
}
.user-viewport-height-note {
  max-height: calc(362px - 144px);
}
.btn-no-bg::before {
  background-color: transparent !important;
}
.no-uppercase {
  text-transform: unset !important;
}
</style>
