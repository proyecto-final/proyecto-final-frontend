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
      <div class="d-flex" style="height: 500px">
        <div class="log-number-div">
          1
        </div>
        <div v-for="(line, index) in lines" :key="index" class="log-div">
          {{ line.raw }}
        </div>
        <div class="timeline-div">
          <div>
            <ShHeading3 class="ma-5">
              Timeline
            </ShHeading3>
          </div>
          <v-timeline dense clipped-left class="mt-4">
            <v-timeline-item
              class="mb-4"
              color="primary"
              small
            >
              <ShBodySmall>
                1: Soy un log con comple...
              </ShBodySmall>
              <ShSpecialLabelSmall>
                14 de abril, 2022 03:24
              </ShSpecialLabelSmall>
            </v-timeline-item>
          </v-timeline>
        </div>
      </div>
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
  width: 75%;
}
.log-number-div {
  background-color: white;
  border-top-style: solid !important;
  border-top-color: var(--v-background-base) !important;
  border-top: 1px;
  width: 5%;
  margin-left: -23px;
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
