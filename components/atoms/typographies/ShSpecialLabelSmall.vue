<template>
  <span class="sh-special-label-small" :class="{'neutral-text': neutral}">
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
.sh-special-label-small {
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: var(--v-neutral-darken2);
}
</style>
