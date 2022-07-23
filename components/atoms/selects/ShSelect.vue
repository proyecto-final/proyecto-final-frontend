<template>
  <v-select
    outlined
    rounded
    hide-details
    :menu-props="{ offsetY: true }"
    append-icon="mdi-chevron-down"
    item-text="text"
    item-value="value"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>
<style scoped>
:not(.v-input--is-focused) ::v-deep .v-input__slot fieldset {
  border-color: var(--v-neutral-darken1);
}
:not(.v-input--is-focused) ::v-deep .v-icon {
  color: var(--v-neutral-darken2);
}
::v-deep .v-select__selections  {
  color: var(--v-neutral-darken2) !important;
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
}
</style>
