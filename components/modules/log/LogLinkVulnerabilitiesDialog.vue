<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Vincular"
    title="Vincular evento"
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
              mdi-link
            </v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>
            <ShBodySmall class="neutral-darken-text">
              Vincular evento
            </ShBodySmall>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <template #default>
      <div class="mb-4">
        <ShAutocomplete
          v-model="vulnerabilityToAdd"
          :search-input.sync="filter.name"
          hide-details
          clearable
          hide-no-data
          filled
          background-color="neutral darken-1"
          :items="availableVulnerabilities"
          item-text="description"
          return-object
          placeholder="Nombre del evento"
          :loading="loading"
        />
      </div>
      <div v-for="(vulnerability,index) in selectedVulnerabilities" :key="index" class="px-4">
        <div class="d-flex justify-space-between align-center py-3">
          <div class="d-flex flex-column">
            <ShBody>
              {{ vulnerability.name }}
            </ShBody>
          </div>
          <div>
            <ShIconButton icon="mdi-close" title="Quitar" @click="removeVulnerability(index)" />
          </div>
        </div>
        <v-divider v-if="index !== (selectedVulnerabilities.length - 1)" />
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
      default: null
    },
    logId: {
      type: String,
      default: null
    },
    lineId: {
      type: String,
      default: null
    }
  },
  data: () => ({
    selectedVulnerabilities: [],
    vulnerabilityToAdd: null,
    vulnerabilities: [],
    loading: false,
    filter: {
      name: null,
      level: null,
      references: []
    }
  }),
  fetch () {
    this.loading = true
    this.$logService.getVulnerabilities(this.projectId, {
      offset: 0,
      limit: 10,
      ...this.filter
    }).then((result) => {
      this.vulnerabilities = result.rows.map(vuln => ({ ...vuln, description: vuln.name }))
    }).finally(() => { this.loading = false })
  },
  computed: {
    availableVulnerabilities () {
      return this.vulnerabilities.filter(vuln => !this.selectedVulnerabilities.some(selectedVuln => selectedVuln._id === vuln._id))
    }
  },
  watch: {
    'filter.name' (val) {
      if (val) {
        this.loading = true
        this.fetchDebounced()
      }
    },
    vulnerabilityToAdd (val) {
      this.addVulnerability(val)
    }
  },
  methods: {
    save () {
      const linkedVulnerabilities = this.selectedVulnerabilities.map(vuln => ({ id: vuln._id }))
      return this.$logService.updateLine(this.projectId, this.logId, this.lineId, linkedVulnerabilities)
        .then(() => {
          this.$emit('updated')
          return true
        })
        .catch((error) => {
          const msg = error.response?.data?.msg
          if (msg) {
            this.$noty.warn(msg.join(', '))
          }
          return false
        })
    },
    addVulnerability (vulnerabilityToAdd) {
      if (vulnerabilityToAdd) {
        this.$nextTick(() => {
          this.selectedVulnerabilities.push(cloneDeep(vulnerabilityToAdd))
          this.vulnerabilityToAdd = null
        })
        this.filter.name = ''
      }
    },
    async setInitialData () {

    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    removeVulnerability (vulnerabilityIndex) {
      this.selectedVulnerabilities.splice(vulnerabilityIndex, 1)
      this.vulnerabilityToAdd = null
      this.filter.name = ''
    }
  }
}
</script>
