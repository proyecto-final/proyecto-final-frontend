<template>
  <ShButton class="mx-2" :loading="gettingLink" @click="copyLinkToClipboard">
    <v-icon>mdi-content-copy</v-icon>
    Copiar link
  </ShButton>
</template>
<script>
export default {
  props: {
    redirectTo: {
      type: String,
      required: true
    },
    successMessage: {
      type: String,
      required: true
    },
    organizationId: {
      type: String,
      required: true
    },
    timelineId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    gettingLink: false
  }),
  methods: {
    copyLinkToClipboard () {
      this.gettingLink = true
      const request = !this.timelineId
        ? this.$organizationService.getInvitationToken(this.organizationId)
        : this.$timelineService.getInvitationToken(this.organizationId, this.timelineId)
      request.then((response) => {
        const URLToCopy = `${window.location.origin}/${this.redirectTo}?token=${response.invitationToken}`
        navigator.clipboard.writeText(URLToCopy)
        this.$noty.success(this.successMessage)
      }).catch((error) => {
        const msg = error.response?.data?.msg
        if (msg) {
          this.$noty.warn(msg.join(', '))
        }
      }).finally(() => { this.gettingLink = false })
    }
  }
}
</script>
