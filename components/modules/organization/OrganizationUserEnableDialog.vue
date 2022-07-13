<template>
  <ShAsyncDialog
    width="500"
    :confirm-text="user.enabled ? 'Deshabilitar' : 'Habilitar'"
    :title="user.enabled ? 'Deshabilitar usuario' : 'Habilitar usuario'"
    :async-confirm-function="save"
    v-on="$listeners"
  >
    <template #activator="{on}">
      <v-list-item v-on="on">
        <v-list-item-title>
          <ShButtonSwitch :enabled="user.enabled" text />
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #default>
      <div>
        <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
          <ShBodySmall v-if="user.enabled" class="white-text">
            Una vez deshabilitado el usuario, no podrá acceder al sistema. Si es necesario, recuerda que tendrás la posibilidad de habilitarlo nuevamente.
          </ShBodySmall>
          <ShBodySmall v-else class="white-text">
            Una vez habilitado el usuario, podrá acceder al sistema. Si es necesario, recuerda que tendrás la posibilidad de deshabilitarlo nuevamente.
          </ShBodySmall>
        </v-alert>
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    organizationId: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    save () {
      return this.$organizationService
        .updateUser(this.organizationId, { id: this.organizationId, role: this.user.role, isAdmin: this.user.isAdmin, enabled: !this.user.enabled })
        .then((res) => {
          this.$emit('updated', { ...this.user, enabled: !this.user.enabled })
          return true
        })
    }
  }
}
</script>
