<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Aceptar"
    title="Vincular usuarios al proyecto"
    :async-confirm-function="save"
    v-on="$listeners"
    @open="setLinkedUsers"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <v-btn
          class="no-uppercase"
          depressed
          color="neutral"
          text
          v-on="on"
        >
          Vincular usuarios
        </v-btn>
      </slot>
    </template>
    <template #default>
      <div class="mb-4">
        <ShHeading4 neutral class="mb-2">
          Asignar usuarios
        </ShHeading4>
        <ShAutocomplete
          v-model="userToAdd"
          hide-details
          clearable
          filled
          background-color="#DFE2F5"
          :items="availableUsers"
          placeholder="Asignar usuarios"
          @input="addUser"
        />
        {{ project.selectedUsers }}
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
const getEmptyProject = () => ({
  prefix: '',
  name: '',
  color: '',
  selectedUsers: []
})
export default {
  data: () => ({
    project: getEmptyProject(),
    userToAdd: null,
    users: [
      '@dummyUser1',
      '@dummyUser2',
      '@dummyUser3',
      '@dummyUser4',
      '@dummyUser5'
    ]
  }),
  computed: {
    availableUsers () {
      return this.users.filter(user => !this.project.selectedUsers.includes(user))
    }
  },
  methods: {
    save () {

    },
    addUser (userToAdd) {
      this.project.selectedUsers.push(userToAdd)
      this.userToAdd = null
    },
    setProject () {
      this.project = getEmptyProject()
    }
  }

}
</script>
<style scoped>
.no-uppercase {
     text-transform: unset !important;
}
</style>
