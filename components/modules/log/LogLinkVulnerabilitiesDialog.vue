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
            <ShBody class="neutral-darken-text">
              Vincular evento
            </ShBody>
          </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </template>
    <template #default>
      <div class="mb-4">
        <ShCombobox
          v-model="vulnerabilityToAdd"
          :search-input.sync="filter.name"
          hide-details
          clearable
          filled
          background-color="neutral darken-1"
          :items="availableVulnerabilities"
          item-text="description"
          return-object
          placeholder="Nombre del evento"
          :loading="loading"
          no-data-text=""
        >
          <template #no-data>
            <v-list-item>
              <v-list-item-content>
                <ShSpecialLabel>
                  El evento buscado no existe, para crearlo presione la tecla <strong>Enter</strong>
                </ShSpecialLabel>
              </v-list-item-content>
            </v-list-item>
          </template>
        </ShCombobox>
      </div>
      <div v-for="(vulnerability,index) in lineVulnerabilities" :key="index" class="px-4">
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
        <v-divider v-if="index !== (lineVulnerabilities.length - 1)" />
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
        const isCustom = typeof vulnerabilityToAdd === 'string' || vulnerabilityToAdd instanceof String
        if (isCustom && (vulnerabilityToAdd.trim().length === 0 || vulnerabilityToAdd.length > 32 || vulnerabilityToAdd.length < 4)) {
          this.$noty.warn('El nombre del evento a crear debe tener de 4 a 32 caracteres')
          return
        }
        this.$nextTick(() => {
          const vulnerability = isCustom
            ? { name: vulnerabilityToAdd, isCustom, isNew: true, level: 'none' }
            : vulnerabilityToAdd
          const existsWithDifferentCase = this.lineVulnerabilities.some(lineVulnerability => lineVulnerability.name.toLowerCase() === vulnerability.name.toLowerCase())
          if (existsWithDifferentCase) {
            this.$noty.warn('El evento ya existe')
            return
          } else {
            this.lineVulnerabilities.push(cloneDeep(vulnerability))
          }
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
