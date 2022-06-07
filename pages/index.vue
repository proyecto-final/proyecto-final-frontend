<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4">
        <v-card-title> Test </v-card-title>
        <ShButton>
          Hola
        </ShButton>
        <v-card-text>
          <div>
            <ShSearchField placeholder="Buscar por nombre" />
          </div>
          <div>
            <ShButton text type="submit">
              Iniciar sesión
            </ShButton>
          </div>
          <div>
            <ShChip color="warning">
              Procesando...
            </ShChip>
            <ShChip color="primary">
              Procesando...
            </ShChip>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Index')
  }
}
</script>
