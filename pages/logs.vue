<template>
  <div>
    <div class="mb-6">
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3">
          <ShSearchField
            v-if="!(logs.length === 0 && !loading && !isFiltering)"
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
            <LogDialog />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-if="!(logs.length === 0 && !loading && !isFiltering)"
            v-model="filter.status"
            hide-details
            clearable
            :items="[{ text: 'Cargado', value: 'loaded' }, { text: 'Procesando...', value: 'loading' }]"
            placeholder="Filtrar por estado"
            @input="$fetch"
          />
        </v-col>
      </v-row>
    </div>
    <div class="mb-6">
      <ShTableEmptyState
        v-if="logs.length === 0 && !loading && !isFiltering"
        class="my-10"
        img-src="/empty-state/logs.svg"
      >
        <template #heading>
          Cargá tu primer log
        </template>
        <template #body>
          Cargá tus logs para empezar con su analisis.<br>
          Una vez que lo hagas, desde acá los verás.
          <div class="mt-7">
            <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
              <v-icon color="white">
                mdi-plus
              </v-icon>
              Cargar log
            </ShButton>
          </div>
        </template>
      </ShTableEmptyState>
      <ShTable
        v-else
        :items="logs"
        :headers="headers"
        :options.sync="options"
        :loading="$fetchState.pending"
        :server-items-length="serverItemsLength"
        @update:options="$fetch"
      >
        <template #[`item.name`]="{ item }">
          <div>
            <ShBodySmall>{{ item.name }}</ShBodySmall>
          </div>
          <div>
            <ShBodySmall neutral>
              {{ item.description }}
            </ShBodySmall>
          </div>
        </template>
        <template #[`item.date`]="{ item }">
          <div>
            <ShBodySmall>{{ item.date | date }} </ShBodySmall>
          </div>
        </template>
        <template #[`item.status`]="{ item }">
          <ShStatusChip :status="item.status" />
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex">
            <ShButton v-if="item.status === 'loaded'" text @click="$router.push(`/logs/${item.id}`)">
              Ver log
            </ShButton>
            <ShButton v-else disabled>
              Ver log
            </ShButton>
            <v-menu v-model="display[item.id]" offset-y close-on-content-click>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-if="item.status === 'loaded'"
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else
                  disabled
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
                Eliminar
              </v-list>
              <v-list>
                <LogEditDialog
                  :project-id="item.projectId"
                  :log-id="item.id"
                  :log2-edit="item"
                  @updated="$fetch"
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
    logs: [],
    display: {},
    options: {
      page: 1,
      itemsPerPage: 10
    },
    filter: {
      name: '',
      status: null
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
        value: 'status'
      },
      {
        text: '',
        value: 'actions',
        width: 0
      }
    ],
    serverItemsLength: 0,
    loading: false
  }),
  fetch () {
    this.loading = true
    this.$organizationService.get({
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.logs = [{ id: '1', name: 'Logcito 1', description: 'Desc log 1', date: '2022-07-17 22:21:58', status: 'loaded', projectId: '1' }, { id: '2', name: 'Logcito 2', description: 'Desc log 2', date: '2022-07-17 22:21:58', status: 'loading', projectId: '1' }]
      this.serverItemsLength = 2
    }).catch(() => {
      this.$noty.warn('Hubo un error al cargar las organizaciones')
    }).finally(() => {
      this.loading = false
    })
  },
  computed: {
    isFiltering () {
      return Object.values(this.filter).some(filterParam => !!filterParam)
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Logs')
    this.$store.commit('navigation/CAN_GO_BACK', false)
  },
  methods: {
    search () {
      this.loading = true
      this.fetchDebounced()
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    setOrganization (organization, updatedOrganization) {
      Object.assign(organization, updatedOrganization)
    }
  }
}
</script>
