<template>
  <ShAsyncDialog
    width="500"
    :confirm-text="organization.enabled ? 'Deshabilitar' : 'Habilitar'"
    :title="organization.enabled ? 'Deshabilitar organización' : 'Habilitar organización'"
    :async-confirm-function="save"
    v-on="$listeners"
  >
    <template #activator="{on}">
      <v-list-item v-on="on">
        <v-list-item-title>
          <ShBody>
            {{ organization.enabled ? 'Deshabilitar' : 'Habilitar' }}
          </ShBody>
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #default>
      <div>
        <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
          <ShBodySmall v-if="organization.enabled" class="white-text">
            Una vez deshabilitada la organización, ningún usuario de la misma podrá acceder al sistema. Si es necesario, recuerda que tendrás la posibilidad de habilitarla nuevamente.
          </ShBodySmall>
          <ShBodySmall v-else class="white-text">
            Una vez habilitada la organización, los usuarios de la misma podrán acceder al sistema. Si es necesario, recuerda que tendrás la posibilidad de deshabilitarla nuevamente.
          </ShBodySmall>
        </v-alert>
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  methods: {
    save () {
      return this.$organizationService
        .update({ id: this.organization.id, enabled: !this.organization.enabled })
        .then((res) => {
          this.$emit('updated', { ...this.organization, enabled: !this.organization.enabled })
          return true
        })
    }
  }
}
</script>
