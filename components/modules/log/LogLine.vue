<template>
  <v-row
    no-gutters
    class="d-flex log-line pl-3"
  >
    <v-col cols="auto" class="clickable" @click="$emit('select:line', line)">
      <div class="mr-6 my-3 d-flex">
        <div v-if="line.isSelected" class="mt-1 px-1">
          <v-icon x-small color="primary">
            mdi-circle
          </v-icon>
        </div>
        <div v-else class="pl-3 pr-2" />
        <div class="mt-1 text-align-center">
          <ShCode>
            {{ line.index }}
          </ShCode>
        </div>
      </div>
    </v-col>
    <v-col>
      <div class="d-flex align-center">
        <div class="mr-5 my-3 max-lines-3">
          <div class="d-flex">
            <div>
              <v-icon class="my-1" @click="showMoreDetails">
                {{ moreInformation ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
              </v-icon>
            </div>
            <div>
              <ShAttributeText attribute-text="timestamp" :value-text="line.timestamp" />
              <ShAttributeText attribute-text="event" :value-text="`${line.detail.eventId}`" />
              <ShAttributeText attribute-text="source-ip" :value-text="line.detail.sourceIp" />
              <ShAttributeText attribute-text="destination-ip" :value-text="line.detail.destinationIp" />
              <ShAttributeText attribute-text="user" :value-text="line.detail.computer" />
            </div>
          </div>
        </div>
        <div>
          <LogLineVulnerabilityDialog
            v-for="(vulnerability, index) in line.vulnerabilites"
            :key="`${line._id}-${index}`"
            :vulnerability="vulnerability"
          />
          <ShChip
            v-if="line.notes.length > 0"
            color="note2"
            class="mx-1"
          >
            <v-icon>
              mdi-note-text
            </v-icon>
            Nota agregada
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
          <v-list color="neutral darken-1" nav>
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
            <LogDialogNote
              :project-id="projectId"
              :log-id="logId"
              :line="line"
              @updated="line => $emit('update:line', line)"
            />
            <LogLinkVulnerabilitiesDialog
              :project-id="projectId"
              :log-id="logId"
              :line="line"
              @updated="line => $emit('update:line', line)"
            />
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
      <LogLineMoreDetails v-if="moreInformation" :line="line" />
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    line: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    moreInformation: false
  }),
  computed: {
    projectId () {
      return this.$route.params.projectId
    },
    logId () {
      return this.$route.params.logId
    }
  },
  methods: {
    showMoreDetails () {
      this.moreInformation = !this.moreInformation
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
