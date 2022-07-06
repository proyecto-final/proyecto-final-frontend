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
            <ShButton>
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
            label="Filtrar por estado"
            @input="$fetch"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.project"
            hide-details
            clearable
            :items="[{ text: 'Work in progress...', value: true }]"
            label="Filtrar por proyecto"
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
        <template #[`item.role`]="{ }">
          <v-icon>
            mdi-account-hard-hat
          </v-icon>
        </template>
        <template #[`item.actions`]="{ item }">
          <ShButtonSwitch :enabled="item.enabled" text />
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
        value: 'role'
      },
      {
        text: '',
        value: 'actions',
        width: '0'
      }
    ],
    serverItemsLength: 0,
    loading: false
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
      return Object.values(this.filter).some(filterParam => filterParam !== null && filterParam !== '')
    }
  },
  methods: {
    search () {
      this.loading = true
      this.fetchDebounced()
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
