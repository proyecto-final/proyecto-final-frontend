<template>
  <v-btn
    :text="text"
    color="primary"
    class="text-transform-none sh-button"
    v-bind="$attrs"
    rounded
    v-on="$listeners"
  >
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
    <template #default>
      <ShSpecialButton :class="{ 'white-text': !text, 'primary-text': text }">
        <slot />
      </ShSpecialButton>
    </template>
  </v-btn>
</template>
<script>
export default {
  props: {
    text: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
.theme--light.sh-button::before{
  opacity: 0.10;
}
.theme--light.sh-button:hover::before{
  opacity: 0.20;
}
.sh-button{
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
</style>
