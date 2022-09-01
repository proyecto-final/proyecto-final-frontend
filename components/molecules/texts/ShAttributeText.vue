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
      type: String,
      default: '-'
    }
  }
})
</script>
<style scoped>
.border-span{
  border: solid #dfe2f5;
  background-color: #dfe2f5;
  display: inline-flex;
}
</style>
