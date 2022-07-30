<template>
  <span class="sh-code" :class="{'neutral-text': neutral, 'strong-text': strong}">
    <slot />
  </span>
</template>
<script>
export default {
  props: {
    neutral: {
      type: Boolean,
      default: false
    },
    strong: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
.sh-code {
  font-family: 'Code-Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--v-neutral-darken2);
}
.strong-text {
  font-family: 'Code-Bold' !important;
}
</style>
