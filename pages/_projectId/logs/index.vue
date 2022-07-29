<template>
  <div>
    <div>
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3">
          <ShSearchField
            v-model="filter.title"
            hide-details
            clearable
            placeholder="Buscar por nombre"
            maxlength="32"
            @input="fetchDebounced"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <div class="d-flex justify-end">
            <LogDialog :project-id="projectId" @created="$fetch" />
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.state"
            hide-details
            clearable
            :items="[{ text: 'Cargado', value: 'processed' }, { text: 'Procesando...', value: 'processing' }]"
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
            <ShBodySmall>{{ item.title }}</ShBodySmall>
          </div>
          <div>
            <ShBodySmall neutral>
              {{ item.description }}
            </ShBodySmall>
          </div>
        </template>
        <template #[`item.date`]="{ item }">
          <div>
            <ShBodySmall>{{ item.updatedAt | dateTime }} </ShBodySmall>
          </div>
        </template>
        <template #[`item.status`]="{ item }">
          <ShChip :color="item.state === 'processed' ? 'success' : 'warning'">
            {{ item.state === 'processed' ? 'Cargado' : 'Procesando...' }}
          </ShChip>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex">
            <ShButton :disabled="item.state === 'processing'" text @click="redirectToLogPage(item._id)">
              Ver log
            </ShButton>
            <v-menu v-model="display[item._id]" offset-y close-on-content-click>
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="item.state === 'processing'"
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
                <LogUpdateDialog
                  :project-id="projectId"
                  :log-id="item._id"
                  :log2-edit="item"
                  @updated="$fetch"
                />
              </v-list>
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
      title: '',
      state: null
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
      this.$router.push(`/${this.projectId}/logs/${itemId}`)
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
