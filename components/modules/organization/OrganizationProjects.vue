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
            <OrganizationProjectDialog
              v-if="projects.length !== 0 && !loading && !isFiltering"
              :organization-id="organizationId"
              @created="$fetch"
            />
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="mb-6">
      <ShTableEmptyState
        v-if="projects.length === 0 && !loading && !isFiltering"
        class="my-10"
        img-src="/empty-state/organization-projects.svg"
      >
        <template #heading>
          Creá tu primer proyecto
        </template>
        <template #body>
          Creá tus proyectos para trabajar con tu equipo.<br>
          Una vez que lo hagas, desde acá los visualizarás.
          <div class="mt-7">
            <OrganizationProjectDialog :organization-id="organizationId" @created="$fetch" />
          </div>
        </template>
      </ShTableEmptyState>
      <ShTable
        v-else
        :items="projects"
        :headers="headers"
        :options.sync="options"
        :loading="loading"
        :server-items-length="serverItemsLength"
        @update:options="$fetch"
      >
        <template #[`item.name`]="{ item }">
          <div>
            <ShBodySmall>{{ item.name }} </ShBodySmall>
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
        <template #[`item.userCount`]="{ item }">
          <ShNumberAvatar>
            {{ item.userCount }}
          </ShNumberAvatar>
        </template>
        <template #[`item.color`]="{ item }">
          <v-icon :color="item.color">
            mdi-checkbox-blank-circle
          </v-icon>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex">
            <ShButton text color="error">
              <ShSpecialButtonText class="error-text">
                Eliminar
              </ShSpecialButtonText>
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
              <v-list nav>
                <v-list-item>
                  <OrganizationProjectDialog
                    :organization-id="organizationId"
                    :project-id="item.id"
                    is-editing
                    :project2-edit="item"
                    @updated="$fetch"
                  />
                </v-list-item>
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
  props: {
    organizationId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    projects: [],
    display: {},
    options: {
      page: 1,
      itemsPerPage: 10
    },
    filter: {
      name: null,
      date: null
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
        text: 'Usuarios',
        value: 'userCount'
      },
      {
        text: 'Color',
        value: 'color'
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
    this.$organizationService.getProjects(this.organizationId, {
      offset: (this.options.page - 1) * this.options.itemsPerPage,
      limit: this.options.itemsPerPage,
      ...this.filter
    }).then((result) => {
      this.projects = result.rows
      this.serverItemsLength = result.count
    }).catch(() => {
      this.$noty.warn('Hubo un error al cargar los proyectos')
    }).finally(() => {
      this.loading = false
    })
  },
  computed: {
    isFiltering () {
      return Object.values(this.filter).some(filterParam => !!filterParam)
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
