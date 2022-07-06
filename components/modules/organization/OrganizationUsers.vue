<template>
  <div>
    <div class="mb-6">
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3">
          <ShSearchField
            v-model="filter.name"
            hide-details
            :clearable="true"
            placeholder="Buscar por nombre"
            maxlength="32"
            @input="fetchDebounced"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <div class="d-flex justify-end">
            <OrganizationDialog @onConfirm="$fetch" />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.enabled"
            hide-details
            :clearable="true"
            :items="[{ text: 'Habilitado', value: true }, { text: 'Deshabilitado', value: false }]"
            placeholder="Filtrar por estado"
            @input="$fetch"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.enabled"
            hide-details
            :clearable="true"
            :items="[{ text: 'Work in progress...', value: true }]"
            placeholder="Filtrar por proyecto"
          />
        </v-col>
      </v-row>
    </div>
    <div class="mb-6">
      <ShTable
        :items="users"
        :headers="headers"
        :options.sync="options"
        :loading="$fetchState.pending"
        :server-items-length="serverItemsLength"
        @update:options="$fetch"
      >
        <template #[`item.enabled`]="{ item }">
          <ShEnabledChip :enabled="item.enabled" />
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
      name: '',
      enabled: null
    },
    headers: [
      {
        text: 'Nombre',
        value: 'name'
      },
      {
        text: 'Fecha',
        value: 'date'
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
      }
    ],
    serverItemsLength: 0
  }),
  fetch () {
    this.$organizationService.getUsers(this.organizationId, {
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.users = result.rows
      this.serverItemsLength = result.count
    }).catch(() => {
      this.$noty.warn('Hubo un error al cargar los usuarios')
    })
  },
  methods: {
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
