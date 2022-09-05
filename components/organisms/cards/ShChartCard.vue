<template>
  <v-card class="w-100 pa-4" flat outlined>
    <template #default>
      <div>
        <ShHeading2>
          {{ title }}
        </ShHeading2>
        <ShBodySmall neutral>
          {{ description }}
        </ShBodySmall>
      </div>
      <slot />
    </template>
  </v-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>
