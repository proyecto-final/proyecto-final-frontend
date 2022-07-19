<template>
  <ShAsyncDialog
    width="500"
    :confirm-text="isEditing ? 'Guardar' : 'Crear'"
    :title="isEditing ? 'Actualizar proyecto' : 'Crear proyecto'"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="setProject"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton v-if="!isEditing" :block="$vuetify.breakpoint.smAndDown" v-on="on">
          <v-icon color="white">
            mdi-plus
          </v-icon>
          Crear proyecto
        </ShButton>
        <v-list-item
          v-if="isEditing"
          class="no-uppercase"
          depressed
          color="neutral"
          text
          v-on="on"
        >
          <ShHeading4 class="neutral-text">
            Editar proyecto
          </ShHeading4>
        </v-list-item>
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
            <div>
              <ShTextField
                v-model="project.prefix"
                label="Prefijo"
                :rules="[$rules.required('prefijo'), $rules.fieldLength('prefijo', 2, 8)]"
              />
            </div>
          </v-col>
          <v-col cols="12" md="4" lg="8">
            <div />
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
import { cloneDeep } from 'lodash'
const getEmptyProject = () => ({
  name: '',
  prefix: '',
  color: ''
})
export default {
  props: {
    project2Edit: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    organizationId: {
      type: String,
      required: true
    },
    projectId: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    project: getEmptyProject()
  }),
  methods: {
    save () {
      const savePromise = this.isEditing
        ? this.$organizationService.updateProject(this.organizationId, this.projectId, this.project).then((project) => {
          this.$emit('updated', { ...project })
          return true
        })
        : this.$organizationService.saveProject(this.organizationId, this.project).then((project) => {
          this.$emit('created', { ...project, userCount: 0 })
          return true
        })
      return savePromise.catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      })
    },
    setProject () {
      if (this.isEditing) {
        this.project = cloneDeep(this.project2Edit)
      } else {
        this.project = getEmptyProject()
      }
    }
  }
}
</script>
<style scoped>
.no-uppercase {
     text-transform: unset !important;
}
</style>
