<template>
  <ShDialog
    v-model="open"
    width="500"
    confirm-text="Previsualizar"
    title="Previsualización del timeline"
    fullscreen
    hide-secondary-button
    body-class="bg-default"
    v-on="$listeners"
  >
    <template #activator="{on}">
      <ShButton :disabled="logLines.length == 0" :block="$vuetify.breakpoint.smAndDown" v-on="on">
        Previsualizar timeline
      </ShButton>
    </template>
    <template #prepend-title="{close}">
      <ShIconButton color="neutral" icon="mdi-close" title="Cerrar" @click="close()" />
    </template>
    <template #close>
      <TimelineGenerateDialog :project-id="projectId" :timeline-id="'1'" />
    </template>
    <template #default>
      <v-row justify="center">
        <v-col cols="8">
          <div>
            <v-alert type="warning" icon="mdi-alert" class="justify-space-between mb-6 mt-2">
              <ShBodySmall class="white-text">
                Recordá que el reporte incluye las líneas de código resaltadas y los eventos vinculados.<br>
                Las notas agregadas y análisis de IP son privados.
              </ShBodySmall>
            </v-alert>
          </div>
          <v-tabs background-color="transparent">
            <v-tab>
              Análisis
            </v-tab>
            <v-tab>
              Estadísticas
            </v-tab>
            <v-tab-item class="pb-2">
              <div class="mb-4 mt-4">
                <ShChip class="mx-1" @click="selectAll">
                  <v-icon v-if="isSelectedAll">
                    mdi-check
                  </v-icon>
                  Todos
                </ShChip>
                <ShChip v-for="(tag, index) in distinctTags" :key="index" class="mx-1" @click="selectTag(tag)">
                  <v-icon v-if="tag.isSelected">
                    mdi-check
                  </v-icon>
                  {{ tag.tag }}
                </ShChip>
              </div>
              <v-timeline v-for="(logLine, index) in showableLogLines" :key="index" dense clipped-left>
                <v-timeline-item small color="primary">
                  <v-row>
                    <v-col>
                      <ShBody strong class="mb-4">
                        {{ logLine.raw }}
                      </ShBody>
                      <div>
                        <ShChip
                          v-for="(vulnerability, vulnerabilityIndex) in logLine.vulnerabilites"
                          :key="`${index}-${vulnerabilityIndex}`"
                          class="mb-2 mx-1"
                          color="vulnerability"
                        >
                          <v-icon>
                            mdi-link
                          </v-icon>
                          {{ vulnerability }}
                        </ShChip>
                      </div>
                      <ShChip v-for="(tag, tagIndex) in logLine.tags" :key="`${index}-${tagIndex}`" class="mb-2 mx-1">
                        {{ tag }}
                      </ShChip>
                      <v-menu offset-y :close-on-content-click="false" @input="resetTag">
                        <template #activator="{ on, attrs }">
                          <span
                            v-bind="attrs"
                            v-on="on"
                          >
                            <ShIconButton
                              class="mb-2"
                              color="neutral"
                              icon="mdi-tag-plus"
                              title="Agregar tag"
                            />
                          </span>
                        </template>
                        <template #default>
                          <v-form @submit.prevent="addTag(logLine)">
                            <ShTextField
                              v-model="newTag"
                              hide-details
                              label="Tag *"
                            />
                          </v-form>
                        </template>
                      </v-menu>
                      <div>
                        <ShBody neutral>
                          {{ logLine.timestamp | date }}
                        </ShBody>
                      </div>
                    </v-col>
                    <v-col>
                      <ShIconButton class="d-flex align-center" color="red" icon="mdi-delete" title="Borrar" @click="removeLine(logLine)" />
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </v-timeline>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-card color="#FBE6E5" elevation="0" class="mt-3 w-100">
                    <v-card-text>
                      <div>
                        <v-icon color="#B2453E" class="mt-3 mb-4 mx-4">
                          mdi-code-tags
                        </v-icon>
                      </div>
                      <div>
                        <ShHeading1 class="mb-4 mx-4">
                          {{ logLinesCount }}
                        </ShHeading1>
                      </div>
                      <div>
                        <ShBodySmall neutral class="mb-4 mx-4">
                          Líneas de log analizadas
                        </ShBodySmall>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card color="#F4E6F4" elevation="0" class="mt-3 w-100">
                    <v-card-text>
                      <div>
                        <v-icon color="#9D3F7A" class="mt-3 mb-4 mx-4">
                          mdi-bug
                        </v-icon>
                      </div>
                      <div>
                        <ShHeading1 class="mb-4 mx-4">
                          {{ detectedEvents }}
                        </ShHeading1>
                      </div>
                      <div>
                        <ShBodySmall neutral class="mb-4 mx-4">
                          Eventos analizados
                        </ShBodySmall>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card v-if="detectedEvents > 0" elevation="0" class="w-100">
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center my-4">
                        <ShHeading2 class="mt-3 mb-4">
                          Eventos analizados
                        </ShHeading2>
                        <ShBodySmall neutral>
                          Usuario VS Sherlock
                        </ShBodySmall>
                      </div>
                      <v-row>
                        <v-col class="d-flex justify-content-start">
                          <div class="mr-10">
                            <div>
                              <ShBodySmall strong>
                                {{ detectedEvents }}
                              </ShBodySmall>
                            </div>
                            <div>
                              <ShBodySmall neutral>
                                Total
                              </ShBodySmall>
                            </div>
                          </div>
                          <div class="mx-10">
                            <div>
                              <ShBodySmall strong>
                                {{ userDetectedEvents }}
                              </ShBodySmall>
                            </div>
                            <div>
                              <ShBodySmall neutral>
                                Usuario
                              </ShBodySmall>
                            </div>
                          </div>
                          <div class="mx-10">
                            <div>
                              <ShBodySmall strong>
                                {{ systemDetectedEvents }}
                              </ShBodySmall>
                            </div>
                            <div>
                              <ShBodySmall neutral>
                                Sherlock
                              </ShBodySmall>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                      <div class="my-4">
                        <v-progress-linear
                          rounded
                          height="17"
                          background-color="#0470B8"
                          color="#50A8FF"
                          :value="userDetectedEventsPercentage"
                        />
                      </div>
                      <div class="d-flex justify-center">
                        <div>
                          <v-icon color="#50A8FF">
                            mdi-circle
                          </v-icon>
                          <ShBodySmall neutral class="mx-3">
                            Usuario
                          </ShBodySmall>
                          <v-icon color="#0470B8">
                            mdi-circle
                          </v-icon>
                          <ShBodySmall neutral class="mx-3">
                            Sherlock
                          </ShBodySmall>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </template>
  </ShDialog>
</template>
<script>
export default {
  props: {
    logLines: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    open: false,
    distinctTags: [],
    isSelectedAll: true,
    newTag: ''
  }),
  computed: {
    showableLogLines () {
      const tags2Show = this.distinctTags.filter(tag => tag.isSelected).map(tag => tag.tag)
      return this.isSelectedAll
        ? this.logLines
        : this.logLines.filter(line => line.tags.some(tag => tags2Show.includes(tag)))
    },
    logLinesCount () {
      return this.logLines.length
    },
    detectedEvents () {
      return this.vulnerabilites.length
    },
    vulnerabilites () {
      return this.logLines.map(line => line.vulnerabilites).flat()
    },
    userDetectedEvents () {
      return this.vulnerabilites.filter(vulnerability => vulnerability.isCustom).length
    },
    systemDetectedEvents () {
      return this.vulnerabilites.filter(vulnerability => !vulnerability.isCustom).length
    },
    userDetectedEventsPercentage () {
      return this.detectedEvents === 0 ? 0 : (this.userDetectedEvents / this.detectedEvents) * 100
    },
    projectId () {
      return this.$route.params.projectId
    }
  },
  mounted () {
    const differentTags = new Set(this.logLines.map(line => line.tags).flat())
    this.distinctTags = Array.from(differentTags).map(tag => ({ tag, isSelected: false }))
  },
  methods: {
    selectTag (tag) {
      tag.isSelected = !tag.isSelected
      if (tag.isSelected) {
        this.isSelectedAll = false
      } else if (this.distinctTags.every(tag => !tag.isSelected)) {
        this.isSelectedAll = true
      }
    },
    selectAll () {
      this.isSelectedAll = true
      this.distinctTags.forEach((tag) => {
        tag.isSelected = false
      })
    },
    removeLine (logLine) {
      const remainingLines = this.logLines.filter(line => line !== logLine)
      this.$emit('update:logLines', remainingLines)
      const remainingTags = Array.from(new Set(remainingLines.map(line => line.tags).flat()))
      this.distinctTags = this.distinctTags.filter(tag => remainingTags.includes(tag.tag))
      this.$nextTick(() => {
        if (this.logLines.length === 0) {
          this.open = false
        }
      })
    },
    addTag (logLine) {
      if (!logLine.tags.includes(this.newTag)) {
        this.$emit('update:logLine', {
          logLine,
          tags: [...logLine.tags, this.newTag]
        })
        if (!this.distinctTags.map(tag => tag.tag).includes(this.newTag)) {
          this.distinctTags.push({ tag: this.newTag, isSelected: false })
        }
      }
      this.resetTag()
    },
    resetTag () {
      this.newTag = ''
    }
  }
}
</script>
<style scoped>
.no-uppercase {
     text-transform: unset !important;
}
</style>
