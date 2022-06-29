<template>
  <v-chip
    text
    v-bind="$attrs"
    :color="getLightenColor()"
    :text-color="color"
    class="sh-chip"
    v-on="$listeners"
  >
    <ShSpecialLabel class="inherit-text">
      <slot />
    </ShSpecialLabel>
  </v-chip>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    }
  },
  methods: {
    getLightenColor () {
      const backgroundPerColor = {
        primary: '#E6F1F8',
        warning: '#F8F0DC',
        success: '#E5F5E5'
      }
      return backgroundPerColor[this.color] || 'gray'
    }
  }
}
</script>
<style scoped>
.sh-chip{
  height: 32px;
}
</style>
