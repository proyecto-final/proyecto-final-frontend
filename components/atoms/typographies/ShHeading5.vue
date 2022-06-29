<template>
  <h5 class="sh-heading-5" :class="{'neutral-text': neutral}">
    <slot />
  </h5>
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
.sh-heading-5 {
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: var(--v-neutral-darken2);
}
</style>
