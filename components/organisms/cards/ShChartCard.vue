<template>
  <v-card class="w-100" flat outlined>
    <template #default>
      <div class="mt-4 ml-6">
        <ShHeading2>
          {{ title }}
        </ShHeading2>
        <ShBodySmall neutral>
          {{ description }}
        </ShBodySmall>
      </div>
      <div>
        <ShChip class="mt-4 ml-6">
          4624
        </ShChip>
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
