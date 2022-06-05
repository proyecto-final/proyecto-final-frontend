<template>
  <h4 class="sh-heading-4" :class="{'neutral-text': neutral}">
    <slot />
  </h4>
</template>
<script>
export default {
  props: {
    neutral: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
.sh-heading-4 {
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--v-neutral-darken2);
}
</style>
