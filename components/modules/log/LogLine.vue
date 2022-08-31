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
      <div class="d-flex align-center">
        <ShChipList
          :items="line.vulnerabilites"
          :max-elements2-show="maxVulnerabilities2Show"
          chip-color="vulnerability"
          list-color="avatar1Bg"
        >
          <template #showableChips>
            <LogLineVulnerabilityDialog
              v-for="(showableVulnerability, indexshowableVulnerability) in showableVulnerabilities"
              :key="`${line._id}-${indexshowableVulnerability}`"
              :vulnerability="showableVulnerability"
            />
          </template>
          <template #hiddenChips>
            <v-list-item
              v-for="(hiddenVulnerability, indexhiddenVulnerability) in hiddenVulnerabilities"
              :key="`${line._id}-${indexhiddenVulnerability}`"
            >
              <LogLineVulnerabilityDialog
                :vulnerability="hiddenVulnerability"
              />
            </v-list-item>
          </template>
        </ShChipList>
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
    hiddenVulnerabilities () {
      return this.line.vulnerabilites.slice(this.maxVulnerabilities2Show, this.line.vulnerabilites.length + 1)
    },
    showableVulnerabilities () {
      return this.line.vulnerabilites.slice(0, this.maxVulnerabilities2Show)
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
