<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Guardar"
    title="Analizar IP"
    hide-secondary-button
    :async-confirm-function="save"
    :submit-on-enter="false"
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
    <template #progressBar>
      <div />
    </template>
    <template #default>
      <div>
        <ShCombobox
          v-model="ipToAdd"
          clearable
          filled
          :rules="[$rules.ipFormat]"
          background-color="neutral darken-1"
          :items="availableIPs"
          item-text="description"
          return-object
          :loading="loading"
          placeholder="Dirección de la IP"
          no-data-text=""
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
        <div v-if="!loading && searchedIP">
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
    existingAnalysis: [],
    availableIPs: [],
    selectedNote: null,
    IPs: [],
    ipToAdd: null,
    searchedIP: null,
    loading: false
  }),
  watch: {
    ipToAdd (val) {
      if (val) {
        this.loading = true
        this.searchIp(val)
      }
    }
  },
  methods: {
    async save () {
      try {
        this.loading = true
        if (!this.hasAlreadyBeAnalyzed(this.searchedIP.raw)) {
          await this.$searchIpService.getIpFromLine(this.projectId, this.logId, this.line._id, this.searchedIP.raw)
            .then(async (result) => {
              this.existingAnalysis.push(result)
              const ips = this.existingAnalysis
              this.$emit('update:line', { ...this.line, ips })
              const updatedLine = await this.$logService.updateLine(this.projectId, this.logId, this.line._id, { ips })
              this.$emit('updated', updatedLine)
            }).catch(() => {
              this.$noty.warn('Hubo un error al cargar la dirección IP ingresada')
            })
        } else {
          this.$noty.warn('La dirección IP ingresada ya ha sido analizada o su formato no es válido')
        }
        this.loading = false
        return true
      } catch (error) {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
          this.loading = false
        }
        return false
      }
    },
    searchIp (anIpAddress) {
      if (!this.hasAlreadyBeAnalyzed(anIpAddress)) {
        this.$searchIpService.getIp(this.projectId, anIpAddress)
          .then((result) => {
            this.searchedIP = result
          }).catch(() => {
            this.$noty.warn('Hubo un error al cargar la dirección IP ingresada')
          }).finally(() => {
            this.loading = false
          })
      } else {
        this.searchedIP = this.line.ips.find(ip => ip.raw === anIpAddress)
        this.loading = false
      }
    },
    setInitialData () {
      this.existingAnalysis = this.line.ips
      const detailIPs = [this.line.detail?.sourceIp, this.line.detail?.destinationIp].filter(ip => ip !== '-' && ip)
      this.availableIPs = Array.from(new Set([...detailIPs, ...this.existingAnalysis.map(ip => ip.raw)]))
    },
    hasAlreadyBeAnalyzed (anIpAddress) {
      return this.line.ips.some(ip => ip.raw === anIpAddress)
    }
  }
}
</script>
