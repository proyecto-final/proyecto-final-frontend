<template>
  <ShAsyncDialog
    width="500"
    confirm-text="Guardar"
    cancel-text="Descartar"
    title="Nota"
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
              mdi-note-text
            </v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>
            <ShBody class="neutral-darken-text">
              Agregar una nota
            </ShBody>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <template #default>
      <div class="mb-4">
        <ShTextArea is-note flat />
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
    lineVulnerabilities: [],
    vulnerabilityToAdd: null,
    vulnerabilities: [],
    loading: false,
    filter: {
      name: null,
      level: null,
      references: []
    },
    options: {
      page: 1,
      itemsPerPage: 20
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
      return this.vulnerabilities.filter(vuln => !this.lineVulnerabilities.some(selectedVuln => selectedVuln._id === vuln._id))
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
    async save () {
      try {
        const newVulnerabilities = this.lineVulnerabilities.filter(vulnerability => vulnerability.isNew)
        const savedVulnerabilities = await Promise.all(newVulnerabilities.map(newVulnerability => this.$logService.saveVulnerability(this.projectId, newVulnerability)))
        const existingVulnerabilities = this.lineVulnerabilities.filter(vulnerability => !vulnerability.isNew)
        const vulnerabilites = [...existingVulnerabilities, ...savedVulnerabilities].map(vuln => ({ _id: vuln._id }))
        const updatedLine = await this.$logService.updateLine(this.projectId, this.logId, this.line._id, { vulnerabilites })
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
    addVulnerability (vulnerabilityToAdd) {
      if (vulnerabilityToAdd) {
        this.$nextTick(() => {
          const vulnerability = typeof vulnerabilityToAdd === 'string' || vulnerabilityToAdd instanceof String
            ? { name: vulnerabilityToAdd, isCustom: true, isNew: true, level: 'none' }
            : vulnerabilityToAdd
          this.lineVulnerabilities.push(cloneDeep(vulnerability))
          this.vulnerabilityToAdd = null
        })
        this.filter.name = ''
      }
    },
    setInitialData () {
      this.$fetch()
      this.lineVulnerabilities = cloneDeep(this.line.vulnerabilites)
    },
    fetchDebounced: debounce(function () {
      this.$fetch()
    }, 500),
    removeVulnerability (vulnerabilityIndex) {
      this.lineVulnerabilities.splice(vulnerabilityIndex, 1)
      this.vulnerabilityToAdd = null
      this.filter.name = ''
    }
  }
}
</script>
