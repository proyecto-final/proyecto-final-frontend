<template>
  <v-combobox
    outlined
    dense
    class="sh-combobox"
    v-bind="$attrs"
    height="40"
    rounded
    append-icon="mdi-chevron-down"
    v-on="$listeners"
  >
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
    <template #label>
      <ShSpecialLabel v-if="label">
        {{ label }}
      </ShSpecialLabel>
    </template>
  </v-combobox>
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
