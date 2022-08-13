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
            :class="`mb-3 ${note.isSelected ? 'selected' : 'default'}`"
            flat
            outlined
            @click="editNote(index)"
          >
            <div class="ml-3 d-flex justify-space-between align-center">
              <div>
                <ShBody neutral>
                  {{ cutTo(note.text, 28) }}
                </ShBody>
              </div>
              <div>
                <ShIconButton
                  icon="mdi-trash-can-outline"
                  title="Eliminar"
                  @click="removeNote(index)"
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
              v-model="noteMessage"
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
              @click="saveEdit"
            >
              <v-icon small>
                mdi-plus
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
              <v-icon small>
                mdi-plus
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
    note: {
      text: '',
      isSelected: false
    },
    noteMessage: '',
    isEditing: false,
    editingIndex: null,
    notes: [{ text: 'Esta es una dummy note', isSelected: false }, { text: 'Esta es otra dummy note pero mas larga', isSelected: false }]
  }),
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    save () {
      this.$logService.updateLine(this.projectId, this.logId, this.line._id, this.note)
    },
    setInitialData () {
      this.noteMessage = ''
    },
    addNote () {
      this.notes.push({ text: this.noteMessage, isSelected: false })
      this.noteMessage = ''
    },
    removeNote (noteIndex) {
      this.notes.splice(noteIndex, 1)
    },
    editNote (noteIndex) {
      this.notes.forEach((note) => {
        note.isSelected = false
      })
      this.noteMessage = this.notes[noteIndex].text
      this.notes[noteIndex].isSelected = true
      this.editingIndex = noteIndex
      this.isEditing = true
    },
    saveEdit () {
      this.notes[this.editingIndex].text = this.noteMessage
      this.notes[this.editingIndex].isSelected = false
      this.editingIndex = null
      this.isEditing = false
      this.noteMessage = ''
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
  max-height: calc(392px - 144px);
}
.btn-no-bg::before {
  background-color: transparent !important;
}
.no-uppercase {
  text-transform: unset !important;
}
</style>
