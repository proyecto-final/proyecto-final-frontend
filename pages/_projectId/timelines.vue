<template>
  <div>
    <v-card class="d-flex align-center justify-space-between pa-4">
      <div>
        <v-card-title>Página en construcción</v-card-title>
        <v-card-subtitle>Será desarrollada a la brevedad</v-card-subtitle>
      </div>
      <div>
        <v-icon large>
          mdi-account-hard-hat
        </v-icon>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Timelines')
    this.$store.commit('navigation/CAN_GO_BACK', false)
  }
}
</script>
