<template>
  <ShAsyncDialog
    width="400"
    confirm-text="Guardar"
    cancel-text="Descartar"
    title="Nota"
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
