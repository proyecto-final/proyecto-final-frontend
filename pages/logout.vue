<template>
  <div class="d-flex justify-center">
    <div>
      <v-progress-circular indeterminate color="primary" />
      <ShBody>
        Logging out...
      </ShBody>
    </div>
  </div>
</template>
<script>
export default {
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Log out')
    this.$store.commit('navigation/CAN_GO_BACK', false)
    this.$userService.logout().finally(() => {
      this.$router.push('/login')
    })
  }
}
</script>
