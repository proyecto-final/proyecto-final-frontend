<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4">
        <v-card-title> Test </v-card-title>
        <div>
          <ShSelect
            v-model="e11"
            :items="people"
            item-text="name"
            item-value="name"
          />
        </div>
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
          <div>
            Primer caso: cantidad de avatars supera el limite
            <ShAvatars :avatars-to-show="3" :avatars="[{text:'MU', color:'#BC98F3'},{text:'RD', color:'#FF6961'}, {text:'ED', color:'#F7CAE7'}, {text:'JC', color:'#636363'}, {text:'JC', color:'#A0D2F3'}]" />
            Segundo caso: cantidad de avatars menor al limite
            <ShAvatars :avatars-to-show="6" :avatars="[{text:'MU', color:'#BC98F3'},{text:'RD', color:'#FF6961'}, {text:'ED', color:'#F7CAE7'}, {text:'JC', color:'#636363'}, {text:'JC', color:'#A0D2F3'}]" />
            Tercer caso: cantidad de avatars coincide con el limite
            <ShAvatars :avatars-to-show="5" :avatars="[{text:'MU', color:'#BC98F3'},{text:'RD', color:'#FF6961'}, {text:'ED', color:'#F7CAE7'}, {text:'JC', color:'#636363'}, {text:'JC', color:'#A0D2F3'}]" />
            Caso default: se muestran todos los avatars
            <ShAvatars :avatars="[{text:'MU', color:'#BC98F3'},{text:'RD', color:'#FF6961'}, {text:'ED', color:'#F7CAE7'}, {text:'JC', color:'#636363'}, {text:'JC', color:'#A0D2F3'},{text:'MU', color:'#BC98F3'},{text:'RD', color:'#FF6961'}, {text:'ED', color:'#F7CAE7'}, {text:'JC', color:'#636363'}, {text:'JC', color:'#A0D2F3'}]" />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    e11: [],
    people: [
      { header: 'Group 1' },
      { name: 'Sandra Adams', group: 'Group 1' },
      { name: 'Ali Connors', group: 'Group 1' },
      { name: 'Trevor Hansen', group: 'Group 1' },
      { name: 'Tucker Smith', group: 'Group 1' },
      { divider: true },
      { header: 'Group 2' },
      { name: 'Britta Holt', group: 'Group 2' },
      { name: 'Jane Smith ', group: 'Group 2' },
      { name: 'John Smith', group: 'Group 2' },
      { name: 'Sandra Williams', group: 'Group 2' }
    ]
  }),
  created () {
    this.$store.commit('navigation/SET_PAGE_TITLE', 'Index')
  }
}
</script>
