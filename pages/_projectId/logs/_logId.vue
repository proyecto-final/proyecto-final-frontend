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
      <v-row no-gutters class="border-top bg-white h-100">
        <v-col cols="7" md="8" lg="9" class="border-right">
          <v-row v-for="(line, index) in lines" :key="index" no-gutters class="d-flex log-line mt-5">
            <v-col cols="auto">
              <div class="mr-5 mt-2 mb-2 ml-5">
                {{ index + 8 }}
              </div>
            </v-col>
            <v-col>
              <div class="mr-5 mt-2 mb-2 ml-5">
                {{ line.raw }}
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <div>
            <ShHeading3 class="ma-5">
              Timeline
            </ShHeading3>
          </div>
          <v-timeline dense clipped-left class="mt-4">
            <v-timeline-item
              v-for="(line, index) in lines"
              :key="index"
              class="mb-4"
              color="primary"
              small
            >
              <div>
                <ShBodySmall>
                  {{ index + 1 }}: {{ line.raw }}
                </ShBodySmall>
              </div>
              <div>
                <ShSpecialLabelSmall neutral>
                  14 de abril, 2022 03:24
                </ShSpecialLabelSmall>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    lines: [{ raw: 'Soy un log con complejo de logcito y tengo una IP 127.0.0.1' },
      { raw: 'Soy un log con complejo de logcito y tengo una IP 127.0.0.1' },
      { raw: 'Soy un log con complejo de logcito y tengo una IP 127.0.0.1' },
      { raw: 'Soy un log con complejo de logcito y tengo una IP 127.0.0.1' }]
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
.border-top{
  border-top-style: solid !important;
  border-top-color: var(--v-background-base) !important;
  border-top: 1px;
}
.border-right{
  border-right-style: solid !important;
  border-right-color: var(--v-background-base) !important;
  border-right: 1px;
}
.bg-white {
  background-color: white;
}
.log-line:hover {
  background-color: red;
}
</style>
