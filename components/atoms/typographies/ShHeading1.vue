<template>
  <h1 class="sh-heading-1" :class="{'neutral-text': neutral}">
    <slot />
  </h1>
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
.sh-heading-1 {
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 600;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: var(--v-neutral-darken2);
}
</style>
