<template>
  <v-btn color="gray" class="text-transform-none sh-button" text v-bind="$attrs" v-on="$listeners">
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
    <template #default>
      <ShSpecialButtonText>
        <slot />
      </ShSpecialButtonText>
    </template>
  </v-btn>
</template>
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
