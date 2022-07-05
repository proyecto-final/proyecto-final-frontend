<template>
  <v-autocomplete
    outlined
    dense
    class="sh-autocomplete"
    v-bind="$attrs"
    height="40"
    rounded
    append-icon="mdi-chevron-down"
    v-on="$listeners"
  >
    <template #label>
      <ShSpecialLabel v-if="label">
        {{ label }}
      </ShSpecialLabel>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
:not(.v-input--is-focused) ::v-deep .v-input__slot fieldset {
  border-color: var(--v-neutral-darken1);
}
:not(.v-input--is-focused) ::v-deep .v-icon {
  color: var(--v-neutral-darken2) !important;
}
</style>
