<template>
  <div>
    <div class="d-flex justify-space-between">
      <div>
        <ShSearchField placeholder="Buscar por nombre" />
      </div>
      <div>
        <ShButton>
          <v-icon color="white">
            mdi-plus
          </v-icon>
          Crear organización
        </ShButton>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Organizaciones')
  }
}
</script>
