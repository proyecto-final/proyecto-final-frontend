<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <div>
          <ShAutocomplete
            v-model="val"
            :items="[{text:'Cargado',id:1}, {text:'Procesando',id:2}, {text:'Fallido',id:3}]"
            item-text="text"
            item-value="id"
            return-object
            label="Filtrar por estado"
          />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    val: null
  })
}
</script>
