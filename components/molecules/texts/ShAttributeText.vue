<template>
  <span>
    <span class="border-span my-1">
      <ShCode strong>
        {{ `${attribute}:` }}
      </ShCode>
    </span>
    <ShCode class="ml-2">
      {{ value }}
    </ShCode>
  </span>
</template>
<script>
export default ({
  props: {
    attribute: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: '-'
    }
  }
})
</script>
<style scoped>
.border-span{
  border: solid var(--v-neutral-darken1);
  background-color: var(--v-neutral-darken1);
  display: inline-flex;
}
</style>
