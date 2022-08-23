<template>
  <ShButton text class="mx-2" :loading="gettingLink" @click="copyLinkToClipboard">
    <v-icon>mdi-content-copy</v-icon>
    {{ buttonText }}
  </ShButton>
</template>
<script>
export default {
  props: {
    shareFunction: {
      type: Function,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    }
  },
  data: () => ({
    gettingLink: false
  }),
  methods: {
    copyLinkToClipboard () {
      this.gettingLink = true
      this.shareFunction().finally(() => { this.gettingLink = false })
    }
  }
}
</script>
