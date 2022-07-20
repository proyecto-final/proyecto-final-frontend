<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Aceptar"
    title="Vincular usuarios al proyecto"
    :async-confirm-function="save"
    :submit-on-enter="false"
    v-on="$listeners"
    @open="setInitialData"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <v-list-item
          v-on="on"
        >
          <ShHeading4 class="neutral-text">
            Vincular usuarios
          </ShHeading4>
        </v-list-item>
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
          hide-no-data
          filled
          background-color="#DFE2F5"
          :items="availableUsers"
          item-text="description"
          return-object
          placeholder="Asignar usuarios"
          :loading="loading"
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
import { debounce, cloneDeep } from 'lodash'
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
    },
    userToAdd (val) {
      this.addUser(val)
    }
  },
  methods: {
    save () {
      const linkedUsers = this.selectedUsers.map(user => ({ id: user.id }))
      return this.$organizationService.putProjectUsers(this.organizationId, this.projectId, linkedUsers)
        .then(() => {
          this.$emit('updated')
          return true
        })
        .catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        })
    },
    addUser (userToAdd) {
      if (userToAdd) {
        this.$nextTick(() => {
          this.selectedUsers.push(cloneDeep(userToAdd))
          this.userToAdd = null
        })
        this.filter.name = ''
      }
    },
    async setInitialData () {
      this.selectedUsers = (await this.$organizationService
        .getProject(this.organizationId, this.projectId)).users
      this.$fetch()
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    removeUser (userIndex) {
      this.selectedUsers.splice(userIndex, 1)
      this.userToAdd = null
      this.filter.name = ''
    }
  }
}
</script>
