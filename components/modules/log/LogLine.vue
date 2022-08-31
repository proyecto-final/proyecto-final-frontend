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
            {{ line.index }}
          </ShCode>
        </div>
      </div>
    </v-col>
    <v-col>
      <div class="d-flex align-center">
        <div class="mr-5 my-3 max-lines-3">
          <ShCode>
            {{ line.raw }}
          </ShCode>
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
          <v-list color="neutral darken-1" nav class="sh-scrollbar mh-200-px">
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
            <SearchIpDialog
              v-if="line.detail.sourceIp && line.detail.sourceIp!=='-'"
              :project-id="projectId"
              :log-id="logId"
              :line="line"
              :ip-raw="line.detail.sourceIp"
              @updated="line => $emit('update:line', line)"
            />
            <SearchIpDialog
              v-if="line.detail.destinationIp && line.detail.destinationIp!=='-'"
              :project-id="projectId"
              :log-id="logId"
              :line="line"
              :ip-raw="line.detail.destinationIp"
              @updated="line => $emit('update:line', line)"
            />
          </v-list>
        </v-menu>
      </div>
      <div class="d-flex align-center">
        <div v-if="line.vulnerabilites.length > maxVulnerabilities2Show">
          <LogLineVulnerabilityDialog
            v-for="(vulnerability, index) in getShowableVulnerabilities"
            :key="`${line._id}-${index}`"
            :vulnerability="vulnerability"
          />
          <v-menu
            offset-y
            close-on-content-click
          >
            <template #activator="{ on, attrs }">
              <ShChip v-bind="attrs" color="vulnerability" v-on="on">
                {{ `+ ${line.vulnerabilites.length - maxVulnerabilities2Show}` }}
              </ShChip>
            </template>
            <v-list color="#F4E6F4" nav class="sh-scrollbar mh-200-px">
              <v-list-item
                v-for="(vulnerability, index) in getHiddenVulnerabilities"
                :key="`${line._id}-${index}`"
              >
                <LogLineVulnerabilityDialog
                  :vulnerability="vulnerability"
                />
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div v-else>
          <LogLineVulnerabilityDialog
            v-for="(vulnerability, index) in line.vulnerabilites"
            :key="`${line._id}-${index}`"
            :vulnerability="vulnerability"
          />
        </div>
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
        <LogLineSearchIpDialog
          v-for="(ip, index) in line.ips"
          :key="`${line._id}-${index}`"
          :ip="ip"
        />
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
    }
  },
  data: () => ({
    maxVulnerabilities2Show: 2
  }),
  computed: {
    projectId () {
      return this.$route.params.projectId
    },
    logId () {
      return this.$route.params.logId
    },
    getHiddenVulnerabilities () {
      return [...this.line.vulnerabilites].splice(this.maxVulnerabilities2Show, this.line.vulnerabilites.length)
    },
    getShowableVulnerabilities () {
      return [...this.line.vulnerabilites].splice(0, this.maxVulnerabilities2Show)
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
