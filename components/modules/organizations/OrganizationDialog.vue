<template>
  <ShAsyncDialog
    width="500"
    :confirm-text="isEditing ? 'Guardar' : 'Crear'"
    :title="isEditing ? 'Actualizar organizacion' : 'Crear organización'"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="setOrganization"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
          <v-icon color="white">
            mdi-plus
          </v-icon>
          Crear organización
        </ShButton>
      </slot>
    </template>
    <template #default>
      <div v-if="!isEditing || isEditingName">
        <ShTextField
          v-model="organization.name"
          label="Nombre *"
          :rules="[$rules.required('nombre'), $rules.fieldLength('nombre', 2, 32)]"
        />
      </div>
      <div v-if="!isEditing || isEditingColor" class="mb-4">
        <ShHeading4 neutral class="mb-2">
          Seleccionar color personalizado
        </ShHeading4>
        <ShColorPicker v-model="organization.color" />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
import { cloneDeep } from 'lodash'
const getEmptyOrganization = () => ({
  name: '',
  color: ''
})
export default {
  props: {
    organization2Edit: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    isEditingColor: {
      type: Boolean,
      default: false
    },
    isEditingName: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    organization: getEmptyOrganization()
  }),
  methods: {
    save () {
      const savePromise = this.isEditing
        ? this.$organizationService.update(this.organization).then((res) => {
          this.$emit('updated', this.organization)
          return true
        })
        : this.$organizationService.save(this.organization)
      return savePromise.catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      })
    },
    setOrganization () {
      if (this.isEditing) {
        this.organization = cloneDeep(this.organization2Edit)
      } else {
        this.organization = getEmptyOrganization()
      }
    }
  }
}
</script>
