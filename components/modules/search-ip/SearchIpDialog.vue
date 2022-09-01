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
              Analizar IPs
            </ShBody>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <template #default>
      <div class="mb-4">
        <ShCombobox
          v-model="ipToAdd"
          :search-input.sync="filter.raw"
          hide-details
          clearable
          filled
          background-color="neutral darken-1"
          :items="availableIPs"
          item-text="description"
          return-object
          placeholder="Dirección de la IP"
          :loading="loading"
          no-data-text=""
        >
          <template #no-data>
            <v-list-item>
              <v-list-item-content>
                <ShSpecialLabel>
                  La IP ingresada no existe, para analizarla presione la tecla <strong>Enter</strong>
                </ShSpecialLabel>
              </v-list-item-content>
            </v-list-item>
          </template>
        </ShCombobox>
      </div>
      <div v-if="!loading" class="px-4">
        <SearchIpCard :ip="searchedIP" class="mt-2 mb-6" />
      </div>
    </template>
  </ShAsyncDialog>
</template>
<script>
import { debounce, cloneDeep } from 'lodash'
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
    lineIPs: [],
    availableIPs: [],
    ipToAdd: null,
    selectedNote: null,
    IPs: [],
    filter: {
      raw: null
    },
    searchedIP: {},
    loading: true
  }),
  fetch () {
    /* this.loading = true
    this.$searchIpService.getAnalizedIPsFromLine(this.projectId, {
      offset: 0,
      limit: 10,
      ...this.filter
    }).then((result) => {
      this.IPs = result.rows
    }).finally(() => { this.loading = false }) */
  },
  watch: {
    'filter.raw' (val) {
      if (val) {
        this.loading = true
        this.fetchDebounced()
      }
    },
    ipToAdd (val) {
      this.addIP(val)
    }
  },
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
    },
    addIP (ipToAdd) {
      if (ipToAdd) {
        const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
        if (!(regexExp.test(ipToAdd))) {
          this.$noty.warn('La dirección ingresada debe poseer un formato válido de IP')
          return
        }
        this.$nextTick(() => {
          const ip = this.searchIp(ipToAdd)
          // Falta validar si la IP ya fue analizada, de ser así, le tendría que dar al usuario dos opciones
          // 1) Pisar la IP ya analizada con un nuevo análisis
          // 2) Mostrar el análisis ya hecho
          this.lineIPs.push(cloneDeep(ip))
          this.ipToAdd = null
        })
        this.filter.raw = ''
      }
    },
    setInitialData () {
      this.$fetch()
      this.lineIPs = cloneDeep(this.line.ips)
      this.availableIPs.push(this.line.detail?.sourceIp)
      this.availableIPs.push(this.line.detail?.destinationIp)
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500)
  }
}
</script>
<style scoped>
::v-deep .v-skeleton-loader__image{
  border-radius: 16px !important;
}
</style>
