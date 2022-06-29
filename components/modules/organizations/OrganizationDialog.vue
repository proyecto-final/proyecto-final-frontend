<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Crear"
    title="Crear organización"
    :async-confirm-function="save"
  >
    <template #activator="{on}">
      <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
        <v-icon color="white">
          mdi-plus
        </v-icon>
        Crear organización
      </ShButton>
    </template>
    <template #default>
      <div>
        <ShTextField
          v-model="organization.name"
          label="Nombre *"
          :rules="[$rules.required('nombre')]"
        />
      </div>
      <div>
        <ShTextField
          v-model="organization.color"
          label="Color *"
          :rules="[$rules.required('nombre')]"
        />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  data: () => ({
    organization: {
      name: '',
      color: ''
    }
  }),
  methods: {
    save () {
      console.log('SAVE')
      return Promise.resolve(true)
    }
  }
}
</script>
