<template>
  <ShTextField
    :type="type"
    v-bind="$attrs"
    class="sh-password-field"
    v-on="$listeners"
  >
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
    <template #append>
      <ShIconButton
        v-if="type === 'password'"
        icon="mdi-eye"
        color="neutral"
        title="Mostrar contraseña"
        class="h-22-px"
        @click="type = 'text'"
      />
      <ShIconButton
        v-if="type === 'text'"
        icon="mdi-eye-off"
        color="neutral"
        title="Ocultar contraseña"
        @click="type = 'password'"
      />
    </template>
  </ShTextField>
</template>
<script>
export default {
  data: () => ({
    type: 'password'
  })
}
</script>
<style scoped>
.sh-password-field ::v-deep.v-input__append-inner {
  margin-top: 0px !important;
  display: flex;
  align-self: center;
}
.sh-password-field ::v-deep .v-input__slot{
  padding-right: 10px !important;
}
</style>
