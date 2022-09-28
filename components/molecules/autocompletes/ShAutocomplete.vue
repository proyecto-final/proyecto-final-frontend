<template>
  <v-autocomplete
    v-bind="$attrs"
    outlined
    dense
    class="sh-autocomplete"
    :class="{'show-scroll': showScroll}"
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
    },
    showScroll: {
      type: Boolean,
      default: false
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
.sh-autocomplete.show-scroll ::v-deep .v-select__selections {
  max-height: 100%;
  overflow-y: auto;
}
.sh-autocomplete.show-scroll ::v-deep .v-select__slot{
  padding-top: 4px;
  padding-bottom: 4px;
}
.sh-autocomplete.show-scroll ::v-deep .v-input__append-inner{
  margin-top: 4px !important;
}
.sh-autocomplete ::v-deep .v-select__selections{
  height: 100%;
}
.sh-autocomplete ::v-deep .v-select__selections input{
  max-height: 100%;
}
</style>
