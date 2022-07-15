<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Crear"
    title="Crear proyecto"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="setProject"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
          <v-icon color="white">
            mdi-plus
          </v-icon>
          Crear proyecto
        </ShButton>
      </slot>
    </template>
    <template #default>
      <div>
        <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
          <ShBodySmall class="white-text">
            Recordá que el prefijo hace referencia a las iniciales de tu proyecto.
          </ShBodySmall>
        </v-alert>
      </div>
      <div>
        <v-row>
          <v-col cols="12" md="4" lg="4">
            <ShTextField
              v-model="project.prefix"
              label="Prefijo"
              :rules="[$rules.required('prefijo'), $rules.fieldLength('prefijo', 2, 8)]"
            />
          </v-col>
          <v-col cols="12" md="4" lg="8">
            <ShTextField
              v-model="project.name"
              label="Nombre *"
              :rules="[$rules.required('nombre'), $rules.fieldLength('nombre', 2, 32)]"
            />
          </v-col>
        </v-row>
      </div>
      <div class="mb-4">
        <ShHeading4 neutral class="mb-2">
          Seleccionar color personalizado
        </ShHeading4>
        <ShColorPicker v-model="project.color" />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
const getEmptyProject = () => ({
  name: '',
  prefix: '',
  color: ''
})
export default {
  props: {
    organizationId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    project: getEmptyProject()
  }),
  methods: {
    save () {
      return this.$organizationService.saveProject(this.organizationId, this.project).then((project) => {
        this.$emit('created', { ...project, userCount: 0 })
        return true
      }).catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      })
    },
    setProject () {
      this.project = getEmptyProject()
    }
  }
}
</script>
