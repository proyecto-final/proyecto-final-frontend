<template>
  <div class="d-flex align-center flex-column">
    <v-img :src="imgSrc" width="120px" class="mb-4" />
    <div class="mb-2">
      <ShHeading2>
        <slot name="heading" />
      </ShHeading2>
    </div>
    <div class="d-flex">
      <ShBody class="text-align-center">
        <slot name="body" />
      </ShBody>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    imgSrc: {
      type: String,
      required: true
    }
  }
}
</script>
