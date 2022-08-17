<template>
  <ShAsyncDialog
    width="700"
    confirm-text="Guardar"
    title="Notas"
    hide-secondary-button
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
      <v-row class="justify-center">
        <div>
          <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
            <ShBodySmall class="white-text">
              Serán eliminadas aquellas notas sin contenido al momento de cerrar esta ventana o guardar.
            </ShBodySmall>
          </v-alert>
        </div>
      </v-row>
      <v-row>
        <v-col v-if="notes.length > 0" class="h-100 user-viewport-height-note sh-scrollbar">
          <v-card
            v-for="(note,index) in notes"
            :key="index"
            class="mb-3"
            :class="`${note === selectedNote ? 'bg-selected-note' : 'bg-gray'}`"
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
              maxlength="201"
              minlength="1"
              is-note
              flat
              :rules="[$rules.maxLength(200), $rules.moreThanSpaces('')]"
            />
          </div>
          <div class="d-flex justify-center align-center">
            <ShButton
              text
              small
              class="mb-5"
              @click="addNote"
            >
              <v-icon small>
                mdi-plus
              </v-icon>
              Nueva nota
            </ShButton>
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
    async save () {
      try {
        const notes = this.notes.map(note => note.text)
        this.$emit('update:line', { ...this.line, notes })
        const updatedLine = await this.$logService.updateLine(this.projectId, this.logId, this.line._id, { notes })
        this.$emit('updated', updatedLine)
        return true
      } catch (error) {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      }
    },
    addNote () {
      const note = { text: '' }
      this.notes = this.notes.filter(note => !(note.text.trim().length === 0))
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
    },
    setInitialData () {
      if (this.notes.length > 0) {
        this.notes = this.line.notes.map(note => ({ text: note }))
        this.selectedNote = this.notes[0]
      }
    },
    onlySpaces (str) {
      return str.trim().length === 0
    }
  }
}
</script>
<style scoped>
.v-card.v-sheet.theme--light {
  border-radius: 12px !important;
}
.user-viewport-height-note {
  max-height: 248px;
}
</style>
