<template>
  <v-card class="w-100 box-shadow-none pa-4" height="100%" flat>
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
