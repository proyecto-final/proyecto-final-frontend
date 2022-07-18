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
          :search-input.sync="filter.name"
          hide-details
          clearable
          filled
          background-color="#DFE2F5"
          :items="availableUsers"
          :item-text="user => `${user.name} - @${user.username}`"
          return-object
          placeholder="Asignar usuarios"
          @input="addUser"
        />
      </div>
      <div v-for="(user,index) in project.selectedUsers" :key="index">
        {{ user }}
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
import { debounce } from 'lodash'
const getEmptyLinkedUsers = () => ({
  selectedUsers: []
})
export default {
  props: {
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
    project: getEmptyLinkedUsers(),
    userToAdd: null,
    users: [],
    filter: {
      name: ''
    }
  }),
  fetch () {
    this.$organizationService.getUsers(this.organizationId, {
      offset: 0,
      limit: 10,
      ...this.filter
    }).then((result) => {
      this.users = result.rows
    })
  },
  computed: {
    availableUsers () {
      return this.users.filter(user => !this.project.selectedUsers.some(selectedUser => selectedUser.id === user.id))
    }
  },
  methods: {
    save () {

    },
    addUser (userToAdd) {
      this.project.selectedUsers.push(userToAdd)
      this.userToAdd = null
    },
    setLinkedUsers () {
      this.project = getEmptyLinkedUsers()
      this.$fetch()
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
<style scoped>
.no-uppercase {
     text-transform: unset !important;
}
</style>
