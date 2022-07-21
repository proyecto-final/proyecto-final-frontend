<template>
  <div>
    <div class="mb-6">
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3">
          <ShSearchField
            v-model="filter.name"
            hide-details
            clearable
            placeholder="Buscar por nombre"
            maxlength="32"
            @input="search"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <div class="d-flex justify-end">
            <ShButton :loading="gettingLink" @click="copyRegisterLinkToClipboard()">
              <v-icon color="white">
                mdi-content-copy
              </v-icon>
              Copiar link de registro
            </ShButton>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.enabled"
            hide-details
            clearable
            :items="[{ text: 'Habilitado', value: true }, { text: 'Deshabilitado', value: false }]"
            placeholder="Filtrar por estado"
            @input="$fetch"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.project"
            hide-details
            clearable
            :items="[{ text: 'Work in progress...', value: true }]"
            placeholder="Filtrar por proyecto"
          />
        </v-col>
      </v-row>
    </div>
    <div class="mb-6">
      <ShTableEmptyState v-if="users.length === 0 && !loading && !isFiltering" class="my-10" img-src="/empty-state/organization-users.svg">
        <template #heading>
          Panel de usuarios
        </template>
        <template #body>
          Podrás visualizar los usuarios de tu organización<br>
          y copiar el link de registro para que el<br>
          usuario se cree su cuenta.
        </template>
      </ShTableEmptyState>
      <ShTable
        v-else
        :items="users"
        :headers="headers"
        :options.sync="options"
        :loading="loading"
        :server-items-length="serverItemsLength"
        @update:options="$fetch"
      >
        <template #[`item.enabled`]="{ item }">
          <ShEnabledChip :enabled="item.enabled" />
        </template>
        <template #[`item.name`]="{ item }">
          <div>
            <ShBodySmall>{{ item.name }} </ShBodySmall>
          </div>
          <div>
            <ShBodySmall neutral>
              {{ item.email }}
            </ShBodySmall>
          </div>
        </template>
        <template #[`item.updatedAt`]="{ item }">
          <div>
            <ShBodySmall>{{ item.updatedAt | date }} </ShBodySmall>
          </div>
          <div>
            <ShBodySmall neutral>
              Actualizado
            </ShBodySmall>
          </div>
        </template>
        <template #[`item.projects`]="{ }">
          <v-icon>
            mdi-account-hard-hat
          </v-icon>
        </template>
        <template #[`item.role`]="{ item }">
          <ShSelect
            v-if="item.enabled"
            v-model="item.role"
            :items="roleOptions"
            item-text="text"
            item-value="value"
            @change="updateUserRole(item)"
          />
          <ShBodySmall v-else>
            {{ getRoleTranslation(item.role) }}
          </ShBodySmall>
        </template>
        <template #[`item.actions`]="{ item }">
          <OrganizationUserEnableDialog
            v-model="display[item.id]"
            offset-y
            close-on-content-click
            :user="item"
            :organization-id="organizationId"
            @close="display[item.id] = false"
            @updated="(updatedUser) => setUser(item, updatedUser)"
          />
        </template>
      </ShTable>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
  props: {
    organizationId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    users: [],
    display: {},
    options: {
      page: 1,
      itemsPerPage: 10
    },
    filter: {
      name: null,
      enabled: null,
      project: null
    },
    headers: [
      {
        text: 'Nombre',
        value: 'name'
      },
      {
        text: 'Fecha',
        value: 'updatedAt'
      },
      {
        text: 'Estado',
        value: 'enabled'
      },
      {
        text: 'Proyectos',
        value: 'projects'
      },
      {
        text: 'Rol',
        value: 'role',
        width: '200px'
      },
      {
        text: '',
        value: 'actions',
        width: '0'
      }
    ],
    serverItemsLength: 0,
    loading: false,
    gettingLink: false,
    roleOptions: [{ text: 'Usuario', value: 'User' }, { text: 'Propietario', value: 'Owner' }]
  }),
  fetch () {
    this.loading = true
    this.$organizationService.getUsers(this.organizationId, {
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.users = result.rows
      this.serverItemsLength = result.count
    }).catch(() => {
      this.$noty.warn('Hubo un error al cargar los usuarios')
    }).finally(() => {
      this.loading = false
    })
  },
  computed: {
    isFiltering () {
      return Object.values(this.filter)
        .some(filterParam => filterParam !== null && filterParam !== '')
    }
  },
  methods: {
    getRoleTranslation (role) {
      return this.roleOptions.find(option => option.value === role)?.text
    },
    search () {
      this.loading = true
      this.fetchDebounced()
    },
    updateUserRole (user) {
      this.$organizationService.updateUser(this.organizationId, user).catch(() => {
        this.$noty.warn('Hubo un error al actualizar el usuario')
      })
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    copyRegisterLinkToClipboard () {
      this.gettingLink = true
      return this.$organizationService.getInvitationToken(this.organizationId)
        .then((response) => {
          const registerURL = `${window.location.origin}/register?token=${response.invitationToken}`
          navigator.clipboard.writeText(registerURL)
          this.$noty.success('Se ha copiado el link de registro en el portapapeles')
        }).catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        }).finally(() => { this.gettingLink = false })
    },
    setUser (user, updatedUser) {
      Object.assign(user, updatedUser)
    }
  }
}
</script>
