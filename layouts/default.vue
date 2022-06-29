<template>
  <v-app light>
    <v-main class="bg-default">
      <v-app-bar
        flat
        app
        height="56"
        color="white"
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div>
            <ShDisplayS>
              {{ pageTitle }}
            </ShDisplayS>
          </div>
          <div>
            <UserMenu />
          </div>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        :mini-variant="closed"
        app
        floating
        mobile-breakpoint="-1"
        mini-variant-width="90"
        width="280"
      >
        <div class="sh-scrollbar h-100">
          <v-list :class="{'mx-6': !closed }" class="px-0 menu-list" rounded>
            <v-list-item>
              <v-list-item-icon>
                <v-icon @click.stop="closed = !closed">
                  mdi-menu
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item class="px-0">
              <v-list-item-icon>
                <v-avatar color="blue darken-2">
                  <ShSpecialLabel class="white-text">
                    BO
                  </ShSpecialLabel>
                </v-avatar>
              </v-list-item-icon>
              <v-list-item-title>
                <ShBodySmall neutral>
                  Business O.
                </ShBodySmall>
              </v-list-item-title>
            </v-list-item>
            <div class="mt-5" />
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(menu, index) in menus"
                :key="`menu-${index}`"
                router
                nuxt
                :to="menu.to"
              >
                <v-list-item-icon class="my-2 align-self-center">
                  <v-icon>
                    {{ menu.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  <ShSpecialLabel class="inherit-text">
                    {{ menu.text }}
                  </ShSpecialLabel>
                </v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-navigation-drawer>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    closed: true
  }),
  computed: {
    menus () {
      return [
        {
          icon: 'mdi-file-code',
          text: 'Logs',
          to: '/logs'
        },
        {
          icon: 'mdi-chart-box',
          text: 'Timelines',
          to: '/timelines'
        },
        {
          icon: 'mdi-shield-search',
          text: 'Buscar IP',
          to: '/search-ip'
        },
        {
          icon: 'mdi-domain',
          text: 'Organización',
          to: '/organization'
        },
        {
          icon: 'mdi-web',
          text: 'Organizaciones',
          to: '/organizations'
        },
        {
          icon: 'mdi-account',
          text: 'Perfil',
          to: '/profile'
        }
      ]
    },
    ...mapState('navigation', ['pageTitle'])
  }
}
</script>
