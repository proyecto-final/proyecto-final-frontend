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
            <OrganizationCreateProjectDialog :organization-id="organizationId" />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="filter.date"
            hide-details
            clearable
            :items="[{ text: 'Habilitado', value: true }, { text: 'Deshabilitado', value: false }]"
            placeholder="Filtrar por fecha"
            @input="$fetch"
          />
        </v-col>
      </v-row>
    </div>
    <div class="mb-6">
      <ShTableEmptyState v-if="projects.length === 0 && !loading && !isFiltering" class="my-10" img-src="/empty-state/organization-users.svg">
        <template #heading>
          Creá tu primer proyecto
        </template>
        <template #body>
          Creá tus proyectos para trabajar con tu equipo.<br>
          Una vez que lo hagas, desde acá los visualizarás.
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
        <template #[`item.actions`]="{ }">
          <div class="d-flex">
            <ShButton text>
              Eliminar
            </ShButton>
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
