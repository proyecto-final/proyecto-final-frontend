<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Guardar"
    title="Analizar IP"
    hide-secondary-button
    :async-confirm-function="save"
    :submit-on-enter="false"
    v-on="$listeners"
    @open="searchIp(ipRaw)"
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
              {{ `Analizar IP ${ipRaw}` }}
            </ShBody>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <div v-if="loading">
      <v-skeleton-loader
        type="image"
        class="mb-6 border-image"
      />
    </div>
    <div v-else>
      <SearchIpCard :ip="searchedIP" class="mt-2 mb-6" />
    </div>
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
    },
    ipRaw: {
      type: String,
      required: true
    }
  },
  data: () => ({
    selectedNote: null,
    IPs: [],
    searchedIP: {},
    loading: true
  }),
  methods: {
    async save () {
      try {
        const ips = this.IPs
        this.$emit('update:line', { ...this.line, ips })
        const updatedLine = await this.$logService.updateLine(this.projectId, this.logId, this.line._id, { ips })
        this.$emit('updated', updatedLine)
        return true
      } catch (error) {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
        return false
      }
    },
    searchIp (ipToSearch) {
      this.$searchIpService.getIpFromLine(this.projectId, this.logId, this.line._id, ipToSearch)
        .then((result) => {
          this.searchedIP = result
          this.IPs.push(result)
        }).catch(() => {
          this.$noty.warn('Hubo un error al cargar la dirección IP ingresada')
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped>
::v-deep .v-skeleton-loader__image{
  border-radius: 16px !important;
}
</style>
