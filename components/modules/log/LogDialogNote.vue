<template>
  <ShAsyncDialog
    width="700"
    confirm-text="Guardar"
    title="Notas"
    hide-secondary-button
    :async-confirm-function="save"
    :submit-on-enter="false"
    v-on="$listeners"
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
            :class="`mb-3 ${note === selectedNote ? 'selected' : 'default'}`"
            flat
            outlined
            @click="editNote(note)"
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
                  @click.stop="removeNote(index)"
                />
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col v-else>
          <ShHeading3 neutral class="d-flex justify-center">
            No existen notas...
          </ShHeading3>
        </v-col>
        <v-divider vertical />
        <v-col>
          <div v-if="selectedNote">
            <ShTextArea
              v-model="selectedNote.text"
              placeholder="Escriba su nota..."
              is-note
              flat
              :rules="[$rules.maxLength(70)]"
            />
          </div>
          <div>
            <ShSecondaryButton small @click="addNote">
              <v-icon small>
                mdi-plus
              </v-icon>
              Agregar nota
            </ShSecondaryButton>
          </div>
        </v-col>
      </v-row>
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
    selectedNote: null,
    notes: [],
    loading: false
  }),
  mounted () {
    this.notes = this.line.notes.map(note => ({ text: note }))
  },
  methods: {
    save () {
      const notes = this.notes.map(note => note.text)
      this.$emit('update:line', { ...this.line, notes })
      return this.$logService.updateLine(this.projectId, this.logId, this.line._id, notes).then(() => {
        this.$emit('updated')
        return true
      })
        .catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        })
    },
    addNote () {
      const note = { text: '' }
      this.notes.push(note)
      this.selectedNote = note
    },
    removeNote (noteIndex) {
      this.notes.splice(noteIndex, 1)
      if (!this.notes.includes(this.selectedNote)) {
        this.selectedNote = null
      }
    },
    editNote (note) {
      this.selectedNote = note
    },
    cutTo (str, length) {
      return str.length > length ? `${str.substr(0, length - 3)}...` : str
    }
  }
}
</script>
<style scoped>
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
</style>
