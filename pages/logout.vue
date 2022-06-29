<template>
  <div class="d-flex justify-center">
    <div>
      <v-progress-circular indeterminate="true" color="primary" />
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
    this.$router.push('/login')
  }
}
</script>
