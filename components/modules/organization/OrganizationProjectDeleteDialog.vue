<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Eliminar"
    title="Eliminar proyecto"
    :async-confirm-function="deleteProject"
    :can-confirm="namesMatch"
    v-on="$listeners"
    @open="resetDialog"
  >
    <template #activator="{on}">
      <v-list-item v-on="on">
        <v-list-item-title>
          <ShButton text color="error">
            <ShSpecialButtonText class="error-text">
              Eliminar
            </ShSpecialButtonText>
          </ShButton>
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #default>
      <div>
        <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
          <ShBodySmall class="white-text">
            Una vez que elimines el proyecto, no se recuperará la información de los logs, timelines y usuarios.
          </ShBodySmall>
        </v-alert>
        <ShBodySmall neutral>
          Para eliminar el proyecto, escribí el nombre: <strong>{{ project.name }}</strong>
        </ShBodySmall>
        <ShTextField
          v-model="projectToDeleteName"
          label="Proyecto *"
        />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    organizationId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    projectToDeleteName: ''
  }),
  computed: {
    namesMatch () {
      return this.project.name === this.projectToDeleteName
    }
  },
  methods: {
    deleteProject () {
      if (!this.namesMatch) { return }

      return this.$organizationService
        .deleteProject(this.organizationId, this.project.id)
        .then((res) => {
          this.$emit('deleted')
          return true
        }).catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        })
    },
    resetDialog () {
      this.projectToDeleteName = ''
    }
  }
}
</script>
