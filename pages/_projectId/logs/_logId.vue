<template>
  <div>
    <div>
      <v-row justify="space-between">
        <v-col cols="12" md="4" lg="3">
          <ShSearchField
            v-model="keyword"
            hide-details
            clearable
            placeholder="Buscar por palabra clave"
            maxlength="32"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <div class="d-flex justify-end">
            <ShButton>
              Previsualizar timeline
            </ShButton>
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="state"
            hide-details
            clearable
            :items="[{ text: '24/02/2022', value: 'processed' }, { text: '05/11/2021', value: 'processing' }]"
            placeholder="Filtrar por fecha"
          />
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <ShAutocomplete
            v-model="eventId"
            hide-details
            clearable
            :items="[{ text: '4624', value: '4624' }, { text: '24', value: '24' }]"
            placeholder="Filtrar por evento"
          />
        </v-col>
      </v-row>
      <v-row style="height:800px">
        <div v-for="(line, index) in lines" :key="index" class="log-div">
          {{ index + 1 }} - {{ line.raw }}
        </div>
        <div class="timeline-div">
          HOLA
        </div>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    lines: [{ raw: 'Soy un log con complejo de logcito y tengo una IP 127.0.0.1' }]
  }),
  computed: {
    projectId () {
      return this.$route.params.projectId
    },
    logId () {
      return this.$route.params.logId
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', `Log - ${this.logId}`)
    this.$store.commit('navigation/CAN_GO_BACK', true)
  }
}
</script>
<style scoped>
.log-div {
  background-color: white;
  border-top-style: solid !important;
  border-top-color: var(--v-background-base) !important;
  border-top: 1px;
  width: 80%;
  margin-left: -10px;
  height: 100%;
}
.timeline-div {
  background-color: white;
  border-top-style: solid !important;
  border-top-color: var(--v-background-base) !important;
  border-left-style: solid !important;
  border-left-color: var(--v-background-base) !important;
  border-top: 1px;
  border-left: 1px;
  width: 20%;
  height: 100%;
}
</style>
