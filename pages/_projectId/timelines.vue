<template>
  <div>
    <div v-if="shouldShowEmtpyState" class="mb-6">
      <ShTableEmptyState
        class="my-10"
        img-src="/empty-state/timelines.svg"
      >
        <template #heading>
          Visualización de timelines
        </template>
        <template #body>
          En esta sección verás los timelines generados<br>
          de tus logs. Primero, analizarás el log y luego<br>
          generarás el timeline.
        </template>
      </ShTableEmptyState>
    </div>
    <div v-else>
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3" class="mb-6">
          <ShSearchField
            v-model="filter.title"
            hide-details
            clearable
            placeholder="Buscar por nombre"
            maxlength="32"
            @input="fetchDebounced"
          />
        </v-col>
      </v-row>
      <ShTable
        :items="timelines"
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
        <template #[`item.eventsCount`]="{ item }">
          <ShNumberAvatar>
            {{ item.lines.length }}
          </ShNumberAvatar>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex">
            <ShButton text @click="redirectToTimelinePage(item.id)">
              Ver reporte
            </ShButton>
            <v-menu v-model="display[item._id]" offset-y close-on-content-click>
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
                Editar
              </v-list>
              <v-list>
                <TimelineDeleteDialog
                  offset-y
                  close-on-content-click
                  :timeline="item"
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
    timelines: [],
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
        text: 'Eventos vinculados',
        value: 'eventsCount'
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
    this.$timelineService.get(this.projectId, {
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.timelines = result.rows
      this.serverItemsLength = result.count
    }).catch(() => { this.$noty.warn('Hubo un error al cargar los timelines') })
      .finally(() => { this.loading = false })
  },
  computed: {
    isFiltering () {
      return Object.values(this.filter).some(filterParam => !!filterParam)
    },
    projectId () {
      return this.$route.params.projectId
    },
    shouldShowEmtpyState () {
      return this.timelines.length === 0 && !this.loading && !this.isFiltering
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Timelines')
    this.$store.commit('navigation/CAN_GO_BACK', false)
  },
  methods: {
    search () {
      this.loading = true
      this.fetchDebounced()
    },
    redirectToTimelinePage (itemId) {
      this.$router.push(`/timelines/${itemId}`)
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
