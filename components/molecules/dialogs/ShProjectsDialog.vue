<template>
  <ShDialog
    v-model="open"
    width="500"
    hide-primary-button
    cancel-text="Cerrar"
    title="Proyectos"
    v-on="$listeners"
  >
    <template #activator="{on}">
      <ShIconButton icon="mdi-chevron-right" title="Ver proyectos" v-on="on" />
    </template>
    <div>
      <ShSearchField
        v-model="projectName"
        hide-details
        clearable
        placeholder="Buscar proyectos"
        class="mb-4"
      />
    </div>
    <div class="px-4">
      <div v-for="(project, index) in projects2Show" :key="index" class="d-flex justify-space-between align-center py-2">
        <div class="d-flex justify-space-between">
          <div>
            <v-avatar size="58" :color="project.color">
              <ShSpecialLabel class="white-text">
                {{ project.prefix }}
              </ShSpecialLabel>
            </v-avatar>
          </div>
          <div class="d-flex align-center px-4">
            <ShBodySmall class="neutral-darken1-text">
              {{ project.name }}
            </ShBodySmall>
          </div>
        </div>
        <div v-if="canSwitch">
          <ShBodySmall v-if="currentProject === project" neutral>
            Actual
          </ShBodySmall>
          <ShIconButton v-else icon="mdi-swap-horizontal" title="Seleccionar proyecto" @click="selectProject(project)" />
        </div>
      </div>
    </div>
  </ShDialog>
</template>
<script>
export default {
  props: {
    projects: {
      type: Array,
      required: true
    },
    canSwitch: {
      type: Boolean,
      default: false
    },
    currentProject: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    projectName: '',
    open: false
  }),
  computed: {
    projects2Show () {
      return this.projects.filter(project =>
        project.name.toLowerCase().includes(this.projectName?.toLowerCase()) || !this.projectName)
    }
  },
  watch: {
    open (value) {
      if (value) {
        this.projectName = ''
      }
    }
  },
  methods: {
    selectProject (project) {
      this.$emit('update:currentProject', project)
      this.open = false
    }
  }
}
</script>
