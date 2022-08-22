<template>
  <div class="mb-6">
    <v-row justify="space-between">
      <v-col cols="12" md="4" lg="3">
        <ShSearchField
          v-model="filter.name"
          hide-details
          clearable
          placeholder="Buscar IP"
          maxlength="32"
          class="ml-4 mt-4"
          @input="search"
        />
      </v-col>
    </v-row>
    <SearchIpCard :ip="ip" />
  </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
  data: () => ({
    loading: false,
    filter: {
      name: null,
      date: null
    },
    ip: {
      isReported: true,
      reputation: 70,
      reports: 467,
      country: 'Argentina',
      city: 'General Rodríguez',
      isp: 'Fibertel',
      asn: 'AS3209',
      tor: false,
      vpn: false
    }
  }),
  fetch () {
    this.loading = true
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Buscar IPS')
    this.$store.commit('navigation/CAN_GO_BACK', false)
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
