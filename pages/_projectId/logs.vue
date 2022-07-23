<template>
  <div>
    <template v-if="showEmptyState">
      <ShTableEmptyState
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
            <ShButton :block="$vuetify.breakpoint.smAndDown">
              <v-icon color="white">
                mdi-plus
              </v-icon>
              Cargar log
            </ShButton>
          </div>
        </template>
      </ShTableEmptyState>
    </template>
    <div v-else>
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
            <ShButton :block="$vuetify.breakpoint.smAndDown">
              <v-icon color="white">
                mdi-plus
              </v-icon>
              Cargar log
            </ShButton>
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.status"
            hide-details
            clearable
            :items="[{ text: 'Cargado', value: 'loaded' }, { text: 'Procesando...', value: 'loading' }]"
            placeholder="Filtrar por estado"
            @input="$fetch"
          />
        </v-col>
      </v-row>
      <ShTable
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
          <ShChip :color="item.status === 'processed' ? 'success' : 'warning'">
            {{ item.status === 'processed' ? 'Cargado' : 'Procesando...' }}
          </ShChip>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex">
            <ShButton :disabled="item.status === 'processing'" text @click="redirectToLogPage(item.id)">
              Ver log
            </ShButton>
            <v-menu v-model="display[item.id]" offset-y close-on-content-click>
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="item.status === 'processing'"
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
                <LogDeleteDialog
                  offset-y
                  close-on-content-click
                  :log="item"
                  :project-id="projectId"
                  @deleted="$fetch"
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
    this.$logService.get(this.projectId, {
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.logs = result.rows
      this.serverItemsLength = result.count
    }).catch(() => { this.$noty.warn('Hubo un error al cargar los logs') })
      .finally(() => { this.loading = false })
  },
  computed: {
    isFiltering () {
      return Object.values(this.filter).some(filterParam => !!filterParam)
    },
    showEmptyState () {
      return (this.logs.length === 0 && !this.loading && !this.isFiltering)
    },
    projectId () {
      return this.$route.params.projectId
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
    redirectToLogPage (itemId) {
      this.$router.push(`/logs/${itemId}`)
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
