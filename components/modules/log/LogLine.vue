<template>
  <v-row
    no-gutters
    class="d-flex log-line pl-3"
  >
    <v-col cols="auto" class="clickable" @click="$emit('select:line', line)">
      <div class="mr-6 my-3 d-flex">
        <div v-if="line.isSelected" class="px-1">
          <v-icon x-small color="primary">
            mdi-circle
          </v-icon>
        </div>
        <div v-else class="pl-3 pr-2" />
        <div class="text-align-center">
          <ShCode>
            {{ index + 1 }}
          </ShCode>
        </div>
      </div>
    </v-col>
    <v-col>
      <div class="d-flex align-center">
        <div class="mr-5 my-3">
          <ShCode>
            {{ line.raw }}
          </ShCode>
        </div>
        <div>
          <ShChip v-for="detection in line.detections" :key="index + detection" class="mr-2">
            <v-icon>
              mdi-link
            </v-icon>
            {{ detection }}
          </ShChip>
        </div>
        <v-menu
          offset-y
          close-on-content-click
        >
          <template #activator="{ on, attrs }">
            <v-btn
              class="action-button"
              v-bind="attrs"
              small
              icon
              v-on="on"
            >
              <v-icon>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <v-list nav>
            <v-list-item @click="$emit('select:line', line)">
              <v-list-item-icon>
                <v-icon>
                  mdi-circle-medium
                </v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>
                <ShBody>
                  {{ line.isSelected ? 'Desmarcar línea' : 'Marcar línea' }}
                </ShBody>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>
                  mdi-note-text
                </v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>
                <ShBody>
                  Agregar una nota
                </ShBody>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <LogLinkVulnerabilitiesDialog
                :project-id="projectId"
                :log-id="logId"
                :line="line"
                @updated="line => $emit('update:line', line)"
              />
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>
                  mdi-shield-search
                </v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>
                <ShBody>
                  Analizar IP
                </ShBody>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    line: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    projectId () {
      return this.$route.params.projectId
    },
    logId () {
      return this.$route.params.logId
    }
  }
}
</script>
<style scoped lang="scss">
.log-line:hover {
  background-color: var(--v-background-lighten2) !important;
  & .action-button {
    display: block !important;
  }
}
</style>
