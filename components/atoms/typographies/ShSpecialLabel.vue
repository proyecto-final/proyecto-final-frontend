<template>
  <span class="sh-special-label" :class="{'neutral-text': neutral}">
    <slot />
  </span>
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
.sh-special-label {
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: var(--v-neutral-darken2);
}
</style>
