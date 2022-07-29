<template>
  <div>
    pepe
  </div>
</template>
<script>
export default {
  data: () => ({
    lines: [{ raw: 'Soy un log con complejo de logcito y tengo una IP 127.0.0.1' }]
  }),
  computed: {
    projectId () {
      return this.$route.params.projectId
    },
    logId () {
      return this.$route.params.logId
    }
  },
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', `Log - ${this.logId}`)
    this.$store.commit('navigation/CAN_GO_BACK', true)
  }
}
</script>
