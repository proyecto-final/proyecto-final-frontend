<template>
  <ShTextField
    v-bind="$attrs"
    class="align-magnify"
    v-on="$listeners"
  >
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
    <template #prepend-inner>
      <v-icon>
        mdi-magnify
      </v-icon>
    </template>
  </ShTextField>
</template>
<style scoped>
.align-magnify ::v-deep .v-input__prepend-inner{
  align-self: center;
  margin-top: 0 !important;
}
</style>
