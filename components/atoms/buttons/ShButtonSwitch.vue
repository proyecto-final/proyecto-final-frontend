<template>
  <ShButton
    :color="enabled ? 'error' : 'primary'"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
    <template #default>
      <ShSpecialButtonText :class="[enabled ? 'error-text': 'primary-text']">
        <slot>
          {{ enabled ? 'Deshabilitar' : 'Habilitar' }}
        </slot>
      </ShSpecialButtonText>
    </template>
  </ShButton>
</template>
<script>
export default {
  props: {
    enabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
