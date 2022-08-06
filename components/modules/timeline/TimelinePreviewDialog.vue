<template>
  <ShDialog
    width="500"
    confirm-text="Previsualizar"
    title="Previsualización del timeline"
    fullscreen
    hide-secondary-button
    v-on="$listeners"
  >
    <template #activator="{on}">
      <ShButton :block="$vuetify.breakpoint.smAndDown" v-on="on">
        Previsualizar timeline
      </ShButton>
    </template>
    <template #prepend-title="{close}">
      <ShIconButton color="neutral" icon="mdi-close" title="Cerrar" @click="close" />
    </template>
    <template #close>
      <TimelineGenerateDialog />
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
              <div>
                <ShChip @click="selectAll">
                  Todos
                </ShChip>
                <ShChip v-for="(tag, index) in differentTags" :key="index" @click="selectTag(tag)">
                  {{ tag.tag }}
                </ShChip>
              </div>
              <v-timeline v-for="(logLine, index) in logLines" :key="index" dense clipped-left>
                <v-timeline-item small>
                  <v-row>
                    <v-col>
                      <ShBody strong class="mb-4">
                        {{ logLine.title }}
                      </ShBody>
                      <div>
                        <ShChip v-for="(detection, detectionIndex) in logLine.detections" :key="`${index}-${detectionIndex}`" class="mb-2" color="red">
                          <v-icon>
                            mdi-link
                          </v-icon>
                          {{ detection }}
                        </ShChip>
                      </div>
                      <ShChip v-for="(tag, tagIndex) in logLine.tags" :key="`${index}-${tagIndex}`" class="mb-2">
                        {{ tag }}
                      </ShChip>
                      <ShChip class="mb-2">
                        <ShIconButton color="neutral" icon="mdi-tag-plus" title="Agregar tag" @click="$emit('addTag', tagIndex)" />
                      </ShChip>
                      <div>
                        <ShBody neutral>
                          {{ logLine.updatedAt | date }}
                        </ShBody>
                      </div>
                    </v-col>
                    <v-col>
                      <ShIconButton class="d-flex align-center" color="red" icon="mdi-delete" title="Borrar" @click="$emit('removeLine', index)" />
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </v-timeline>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-card>
                    <div>
                      <v-icon :small="small" :color="color">
                        mdi-code-tags
                      </v-icon>
                    </div>
                    <div>
                      <ShHeading1>
                        {{ logLinesCount }}
                      </ShHeading1>
                    </div>
                    <div>
                      <ShBodySmall>Líneas de log analizadas</ShBodySmall>
                    </div>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card>
                    <div>
                      <v-icon :small="small" :color="color">
                        mdi-bug
                      </v-icon>
                    </div>
                    <div>
                      <ShHeading1>22</ShHeading1>
                    </div>
                    <div>
                      <ShBodySmall>Eventos analizados</ShBodySmall>
                    </div>
                    <div>
                      {{ detectedEvents }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card>
                    <div>
                      <ShHeading2>Líneas analizadas</ShHeading2>
                    </div>
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
    distinctTags: [],
    isSelectedAll: true
  }),
  computed: {
    showableLogLines () {
      const tags2Show = this.distinctTags.map(tag => tag.tag)
      return this.isSelectedAll
        ? this.logLines
        : this.logLines.filter(line => line.tags.some(tag => tags2Show.includes(tag)))
    },
    logLinesCount () {
      return this.logLines.length
    },
    detectedEvents () {
      return this.logLines.reduce((prev, curr) => prev + curr.detections.length, 0)
    }
  },
  mounted () {
    const differentTags = new Set(this.logLines.map(line => line.tags).flat())
    this.distinctTags = differentTags.map(tag => ({ tag, isSelected: false }))
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
    }
  }
}
</script>
<style scoped>
.no-uppercase {
     text-transform: unset !important;
}
</style>
