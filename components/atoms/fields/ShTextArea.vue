<template>
  <v-textarea
    class="neutral-background"
    filled
    dense
    rounded
    no-resize
    height="144"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </v-textarea>
</template>
<style scoped>
.neutral-background > ::v-deep.v-input__control > .v-input__slot {
  background: var(--v-neutral-darken1) !important  ;
}
</style>
