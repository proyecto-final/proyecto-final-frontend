<template>
  <div :class="{ 'bg-gray rounded-border': open }" class="clickable pa-2 smooth-transition">
    <v-menu v-model="open" offset-y nudge-bottom="24">
      <template #activator="{ on }">
        <span v-on="on">
          <v-avatar color="green darken-2" size="32">
            <ShSpecialLabelSmall class="white-text">
              AA
            </ShSpecialLabelSmall>
          </v-avatar>
          <v-icon v-if="open">
            mdi-chevron-up
          </v-icon>
          <v-icon v-else>
            mdi-chevron-down
          </v-icon>
        </span>
      </template>
      <template #default>
        <v-list>
          <v-list-item>
            Logout
          </v-list-item>
        </v-list>
      </template>
    </v-menu>
  </div>
</template>
<script>
export default {
  data: () => ({
    open: false
  })
}
</script>
