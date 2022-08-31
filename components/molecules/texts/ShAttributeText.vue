<template>
  <span>
    <span class="border-span my-1">
      <ShCode strong>
        {{ `${attributeText}:` }}
      </ShCode>
    </span>
    <ShCode class="ml-2">
      {{ valueText }}
    </ShCode>
  </span>
</template>
<script>
export default ({
  props: {
    attributeText: {
      type: String,
      required: true
    },
    valueText: {
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
