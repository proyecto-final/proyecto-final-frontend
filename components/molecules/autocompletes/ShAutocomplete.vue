<template>
  <v-autocomplete
    v-bind="$attrs"
    outlined
    dense
    class="sh-autocomplete"
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
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
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
  },
  methods: {
    cutTo (str, length) {
      return str.length > length ? `${str.substr(0, length - 3)}...` : str
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
