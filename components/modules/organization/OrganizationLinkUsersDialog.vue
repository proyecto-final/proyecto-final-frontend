<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Aceptar"
    title="Vincular usuarios al proyecto"
    :async-confirm-function="save"
    :submit-on-enter="false"
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
          :search-input.sync="filter.name"
          hide-details
          clearable
          filled
          background-color="#DFE2F5"
          :items="availableUsers"
          item-text="description"
          return-object
          placeholder="Asignar usuarios"
          :loading="loading"
          @input="addUser"
        />
      </div>
      <div v-for="(user,index) in selectedUsers" :key="index" class="px-4">
        <div class="d-flex justify-space-between align-center py-3">
          <div class="d-flex flex-column">
            <ShBody>
              {{ user.name }}
            </ShBody>
            <ShBodySmall neutral>
              @{{ user.username }}
            </ShBodySmall>
          </div>
          <div>
            <ShIconButton icon="mdi-close" title="Quitar" @click="removeUser(index)" />
          </div>
        </div>
        <v-divider v-if="index !== (selectedUsers.length - 1)" />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
import { debounce } from 'lodash'
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
    selectedUsers: [],
    userToAdd: null,
    users: [],
    loading: false,
    filter: {
      name: null
    }
  }),
  fetch () {
    this.loading = true
    this.$organizationService.getUsers(this.organizationId, {
      offset: 0,
      limit: 10,
      ...this.filter
    }).then((result) => {
      this.users = result.rows.map(user => ({ ...user, description: `${user.name} - @${user.username}` }))
    }).finally(() => { this.loading = false })
  },
  computed: {
    availableUsers () {
      return this.users.filter(user => !this.selectedUsers.some(selectedUser => selectedUser.id === user.id))
    }
  },
  watch: {
    'filter.name' (val) {
      if (val) {
        this.loading = true
        this.fetchDebounced()
      }
    }
  },
  methods: {
    save () {

    },
    addUser (userToAdd) {
      this.selectedUsers.push(userToAdd)
      this.userToAdd = null
      this.filter.name = ''
    },
    setLinkedUsers () {
      this.selectedUsers = []
      this.$fetch()
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    removeUser (user) {
      this.selectedUsers.splice(user, 1)
    }
  }
}
</script>
<style scoped>
.no-uppercase {
     text-transform: unset !important;
}
</style>
