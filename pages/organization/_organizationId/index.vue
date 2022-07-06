<template>
  <Organization />
</template>
<script>
export default {
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Organización')
    this.$store.commit('navigation/CAN_GO_BACK', true)
  }
}
</script>
