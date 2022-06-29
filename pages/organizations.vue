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
            @input="fetchDebounced"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <div class="d-flex justify-end">
            <ShButton :block="$vuetify.breakpoint.smAndDown">
              <v-icon color="white">
                mdi-plus
              </v-icon>
              Crear organización
            </ShButton>
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
      </v-row>
    </div>
    <div class="mb-6">
      <ShTable
        :items="organizations"
        :headers="headers"
        :options.sync="options"
        :loading="$fetchState.pending"
        :server-items-length="serverItemsLength"
        @update:options="$fetch"
      >
        <template #[`item.color`]="{ item }">
          <v-icon :color="item.color">
            mdi-checkbox-blank-circle
          </v-icon>
        </template>
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
  data: () => ({
    organizations: [],
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
        text: 'Color',
        value: 'color'
      },
      {
        text: 'Habilitado/Deshabilitado',
        value: 'enabled'
      },
      {
        text: 'Usuarios',
        value: 'userCount'
      }
    ],
    serverItemsLength: 0
  }),
  fetch () {
    this.$organizationService.get({
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.organizations = result.rows
      this.serverItemsLength = result.count
    })
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Organizaciones')
  },
  methods: {
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
