<template>
  <h3 class="sh-heading-3" :class="{'neutral-text': neutral}">
    <slot />
  </h3>
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
.sh-heading-3 {
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--v-neutral-darken2);
}
</style>
