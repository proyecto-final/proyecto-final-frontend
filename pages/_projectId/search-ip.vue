<template>
  <div class="mb-6 px-4">
    <v-row justify="space-between">
      <v-col cols="4">
        <v-form ref="form" @submit.prevent="search">
          <ShSearchField
            v-model="filter.ip"
            clearable
            placeholder="Buscar IP"
            class="mt-4"
            :rules="[$rules.required(''), $rules.ipFormat]"
          />
        </v-form>
      </v-col>
    </v-row>
    <span v-for="(ipToShow, index) in analyzedIPs" :key="index" @click="loadIp(ipToShow)">
      <ShChip
        color="#666665"
        class="mr-2 mb-6 clickable"
      >
        {{ ipToShow.raw }}
      </ShChip>
    </span>
    <v-progress-linear v-if="loading && noConsultingAnIp" indeterminate color="primary" />
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
    <v-row v-else no-gutters>
      <v-col cols="4" lg="4" md="6" sm="8">
        <SearchIpCard :ip="ip" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
  data: () => ({
    loading: false,
    noConsultingAnIp: false,
    filter: {
      ip: null
    },
    ip: null,
    analyzedIPs: []
  }),
  fetch () {
    this.loading = true
    this.$searchIpService.getLastAnalyzedIPs(this.projectId, {
      offset: 0,
      limit: 4
    }).then((result) => {
      this.analyzedIPs = result.rows
    }).catch(() => { this.$noty.warn('Hubo un error al cargar las IPs') })
      .finally(() => { this.loading = false })
  },
  computed: {
    projectId () {
      return this.$route.params.projectId
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Buscar IPs')
    this.$store.commit('navigation/CAN_GO_BACK', false)
  },
  methods: {
    search () {
      if (!this.$refs.form.validate() || this.loading) {
        return
      }
      this.loading = true
      this.$searchIpService.getIp(this.projectId, this.filter.ip).then((result) => {
        this.ip = result
        this.fetchDebounced()
      }).catch(() => {
        this.$noty.warn('Hubo un error al cargar la dirección IP ingresada')
      }).finally(() => {
        this.loading = false
      })
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    loadIp (anIpAddress) {
      this.ip = anIpAddress
      this.noConsultingAnIp = true
    }
  }
}
</script>
