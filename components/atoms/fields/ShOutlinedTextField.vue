<template>
  <v-text-field
    outlined
    dense
    height="40"
    rounded
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<style scoped>
:not(.v-input--is-focused) ::v-deep .v-input__slot fieldset {
  border-color: var(--v-neutral-darken1);
}
:not(.v-input--is-focused) ::v-deep .v-icon {
  color: var(--v-neutral-darken2) !important;
}
::v-deep .v-input__prepend-inner{
  margin-top: 4px !important;
}
</style>
