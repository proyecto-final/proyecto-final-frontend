<template>
  <div class="pa-6">
    <div class="mb-6">
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3">
          <ShSearchField
            v-model="filter.name"
            hide-details
            clearable
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
            clearable
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
        <template #[`item.userCount`]="{ item }">
          <ShNumberAvatar>
            {{ item.userCount }}
          </ShNumberAvatar>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex">
            <ShButton text @click="$router.push(`/organization/${item.id}`)">
              Ver organización
            </ShButton>
            <v-menu v-model="display[item.id]" offset-y close-on-content-click>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <OrganizationEnableDialog
                  :organization="item"
                  @close="display[item.id] = false"
                  @updated="(updatedOrganization) => setOrganization(item, updatedOrganization)"
                />
              </v-list>
            </v-menu>
          </div>
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
    display: {},
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
      },
      {
        text: '',
        value: 'actions',
        width: 0
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
    }).catch(() => {
      this.$noty.warn('Hubo un error al cargar las organizaciones')
    })
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Organizaciones')
    this.$store.commit('navigation/CAN_GO_BACK', false)
  },
  methods: {
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    setOrganization (organization, updatedOrganization) {
      Object.assign(organization, updatedOrganization)
    }
  }
}
</script>
