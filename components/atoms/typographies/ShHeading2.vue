<template>
  <h2 class="sh-heading-2" :class="{'neutral-text': neutral}">
    <slot />
  </h2>
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
.sh-heading-2 {
  font-family: 'Nunito-Regular';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: var(--v-neutral-darken2);
}
</style>
