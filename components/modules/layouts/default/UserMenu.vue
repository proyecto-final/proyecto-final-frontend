<template>
  <div :class="{ 'bg-gray rounded-border': open }" class="clickable pa-2 smooth-transition">
    <v-menu v-model="open" offset-y nudge-bottom="24" min-width="150">
      <template #activator="{ on }">
        <span v-on="on">
          <v-progress-circular v-if="isLoadingUser" indeterminate color="primary" />
          <v-avatar v-else color="green darken-2" size="32">
            <ShSpecialLabelSmall class="white-text">
              {{ userInitials }}
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
          <v-list-item @click="$router.push('/logout')">
            <ShBody>Cerrar sesión</ShBody>
          </v-list-item>
        </v-list>
      </template>
    </v-menu>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    open: false
  }),
  computed: {
    userInitials () {
      const getFirstAndLastWord = (_, index, arr) => index === 0 || (arr.length - 1) === index
      return this.user.name?.split(' ')
        .map(word => word[0])
        .filter(getFirstAndLastWord)
        .join('')
    },
    ...mapState('user', ['user', 'isLoadingUser'])
  }
}
</script>
