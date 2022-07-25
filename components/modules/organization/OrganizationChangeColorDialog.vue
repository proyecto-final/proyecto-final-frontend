<template>
  <OrganizationDialog
    is-editing
    is-editing-color
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #activator="{on}">
      <v-icon color="neutral" v-on="on">
        mdi-chevron-right
      </v-icon>
    </template>
  </OrganizationDialog>
</template>
