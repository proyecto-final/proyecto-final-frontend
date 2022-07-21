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
        class="mb-4"
      />
    </div>
    <div class="px-4">
      <div v-for="(project, index) in projects" :key="index" class="d-flex justify-space-between align-center py-2">
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
        <div>
          <ShIconButton v-if="!isActive" icon="mdi-swap-horizontal" title="Cambiar" />
          <ShBodySmall v-else neutral>
            Actual
          </ShBodySmall>
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
    activeProject: '',
    isActive: false
  }),
  methods: {
    save () {

    },
    setProjects () {

    },
    switch (index) {

    }
  }
}
</script>
