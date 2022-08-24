<template>
  <div class="mb-6 px-4">
    <v-row justify="space-between">
      <v-col cols="4">
        <v-form @submit.prevent="search">
          <ShSearchField
            v-model="filter.ip"
            clearable
            placeholder="Buscar IP"
            class="mt-4"
            :rules="[$rules.required(''), $rules.ipFormat()]"
          />
        </v-form>
      </v-col>
    </v-row>
    <v-progress-linear v-if="loading" indeterminate color="primary" />
    <ShTableEmptyState
      v-if="!ip"
      class="my-10"
      img-src="/empty-state/search-ip.svg"
    >
      <template #heading>
        Buscá la IP que necesites
      </template>
      <template #body>
        Ingresá la dirección IP en el buscador<br>
        para visualizar sus detalles.
      </template>
    </ShTableEmptyState>
    <SearchIpCard v-else :ip="ip" />
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false,
    filter: {
      ip: null
    },
    ip: null
  }),
  computed: {
    projectId () {
      return this.$route.params.projectId
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Buscar IPS')
    this.$store.commit('navigation/CAN_GO_BACK', false)
  },
  methods: {
    search () {
      this.loading = true
      this.$searchIpService.getIp(this.projectId, this.filter.ip).then((result) => {
        this.ip = result
      }).catch(() => {
        this.$noty.warn('Hubo un error al cargar la dirección IP ingresada')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
