<template>
  <ShAsyncDialog
    ref="asyncDialog"
    width="500"
    hide-primary-button
    title="Analizar IP"
    :async-confirm-function="analyze"
    v-on="$listeners"
    @open="setInitialData"
  >
    <template #activator="{on}">
      <slot name="activator" :on="on">
        <v-list-item
          v-on="on"
        >
          <v-list-item-icon>
            <v-icon>
              mdi-shield-search
            </v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>
            <ShBody class="neutral-darken-text">
              Analizar IP
            </ShBody>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <template #default>
      <div>
        <ShCombobox
          v-model="ipToAnalyze"
          clearable
          filled
          :rules="[$rules.ipFormat]"
          background-color="neutral darken-1"
          :items="availableIPs"
          item-text="description"
          return-object
          placeholder="Dirección de la IP"
          @change="submitAnalyze"
        >
          <template #no-data>
            <v-list-item>
              <v-list-item-content>
                <ShSpecialLabel>
                  No hay análisis para la ip ingresada, para analizarla presione <strong>Enter</strong>
                </ShSpecialLabel>
              </v-list-item-content>
            </v-list-item>
          </template>
        </ShCombobox>
      </div>
      <div class="mb-6">
        <div v-if="searchedIP">
          <SearchIpCard :ip="searchedIP" />
        </div>
        <div v-else>
          <v-skeleton-loader type="image" />
        </div>
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    projectId: {
      type: String,
      required: true
    },
    logId: {
      type: String,
      required: true
    },
    line: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    availableIPs: [],
    ipToAnalyze: null,
    searchedIP: null
  }),
  computed: {
    existingAnalysis () {
      return this.line.ips
    }
  },
  methods: {
    async submitAnalyze (ipToAnalyze) {
      this.ipToAnalyze = ipToAnalyze
      await this.$nextTick()
      await this.$nextTick()
      this.$refs.asyncDialog.confirm()
    },
    async analyze () {
      try {
        if (!this.ipToAnalyze) {
          return
        }
        let ipAnalysis = this.line.ips.find(ip => ip.raw === this.ipToAnalyze)
        if (!ipAnalysis) {
          ipAnalysis = await this.$searchIpService
            .getIpFromLine(this.projectId, this.logId, this.line._id, this.ipToAnalyze)
          this.$emit('updated', { ...this.line, ips: [...this.existingAnalysis, ipAnalysis] })
        }
        this.searchedIP = ipAnalysis
      } catch (error) {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
      }
      return false
    },
    setInitialData () {
      const detailIPs = [this.line.detail?.sourceIp, this.line.detail?.destinationIp].filter(ip => ip !== '-' && ip)
      this.availableIPs = Array.from(new Set([...detailIPs, ...this.existingAnalysis.map(ip => ip.raw)]))
    }
  }
}
</script>
