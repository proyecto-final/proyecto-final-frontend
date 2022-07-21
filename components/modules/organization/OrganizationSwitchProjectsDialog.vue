<template>
  <ShAsyncDialog
    width="500"
    hide-primary-button
    hide-secondary-button
    title="Proyectos"
    v-on="$listeners"
    @open="setProjects"
  >
    <template #activator="{on}">
      <v-icon color="neutral base" v-on="on">
        mdi-chevron-right
      </v-icon>
    </template>
    <div>
      <ShSearchField
        v-model="project"
        hide-details
        clearable
        placeholder="Buscar proyectos"
      />
    </div>
    <div class="px-4">
      <div v-for="(project, index) in projects" :key="index" class="d-flex justify-space-between align-center py-3">
        <div>
          <v-avatar :color="project.color">
            <ShSpecialLabel class="white-text">
              {{ project.prefix }}
            </ShSpecialLabel>
          </v-avatar>
        </div>
        <div class="d-flex flex-column">
          <ShBodySmall neutral>
            {{ project.name }}
          </ShBodySmall>
        </div>
        <div>
          <ShIconButton icon="mdi-swap-horizontal" title="Cambiar" />
        </div>
      </div>
    </div>
  </ShAsyncDialog>
</template>
<script>
export default {
  props: {
    projects: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    activeProject: ''
  }),
  methods: {
    save () {

    },
    setProjects () {

    },
    switch () {

    }
  }
}
</script>
