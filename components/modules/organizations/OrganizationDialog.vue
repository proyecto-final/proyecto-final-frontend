<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Crear"
    title="Crear organización"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="setOrganization"
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
          :rules="[$rules.required('nombre'), $rules.fieldLength('nombre', 8, 32)]"
        />
      </div>
      <div class="mb-4">
        <ShHeading4 neutral class="mb-2">
          Seleccionar color personalizado
        </ShHeading4>
        <ShColorPicker v-model="organization.color" />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
const getEmptyOrganization = () => ({
  name: '',
  color: ''
})
export default {
  data: () => ({
    organization: getEmptyOrganization()
  }),
  methods: {
    save () {
      return this.$organizationService.save(this.organization).catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      })
    },
    setOrganization () {
      this.organization = getEmptyOrganization()
    }
  }
}
</script>
