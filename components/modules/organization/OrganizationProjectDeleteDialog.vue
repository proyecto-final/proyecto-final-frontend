<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Eliminar"
    title="Eliminar proyecto"
    :async-confirm-function="deleteProject"
    v-on="$listeners"
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
  methods: {
    deleteProject () {
      return this.$organizationService
        .deleteProject(this.organizationId, this.project.id)
        .then((res) => {
          this.$emit('deleted')
          return true
        })
    }
  }
}
</script>
