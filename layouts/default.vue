<template>
  <v-app light>
    <v-main class="bg-default">
      <v-app-bar
        flat
        app
        class="border-bottom"
        height="56"
        color="white"
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center">
            <div v-if="canGoBack" class="mr-2">
              <ShIconButton icon="mdi-arrow-left" title="Volver" color="black" @click="goBack" />
            </div>
            <div>
              <ShDisplayS>
                {{ pageTitle }}
              </ShDisplayS>
            </div>
          </div>
          <div>
            <UserMenu />
          </div>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        :mini-variant="showSidebarSafe"
        app
        floating
        mobile-breakpoint="-1"
        mini-variant-width="90"
        width="280"
      >
        <div class="sh-scrollbar h-100">
          <v-list :class="{'mx-6': !showSidebarSafe }" class="px-0 menu-list" rounded>
            <v-list-item>
              <v-list-item-icon>
                <v-icon @click.stop="showSidebarSafe = !showSidebarSafe">
                  mdi-menu
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item v-if="isLoadingUser">
              <v-list-item-icon>
                <v-progress-circular indeterminate color="primary" />
              </v-list-item-icon>
              <v-list-item-title>
                <ShBody neutral>
                  Cargando...
                </ShBody>
              </v-list-item-title>
            </v-list-item>
            <template v-else>
              <v-list-item v-if="selectedProject" class="px-0">
                <v-list-item-icon>
                  <v-avatar :color="selectedProjectSafe.color">
                    <ShSpecialLabel class="white-text">
                      {{ selectedProjectSafe.prefix }}
                    </ShSpecialLabel>
                  </v-avatar>
                </v-list-item-icon>
                <v-list-item-title>
                  <ShBodySmall neutral>
                    {{ selectedProjectSafe.name }}
                  </ShBodySmall>
                </v-list-item-title>
                <v-list-item-action>
                  <ShProjectsDialog can-switch :current-project.sync="selectedProjectSafe" :projects="projectMenus" />
                </v-list-item-action>
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
            </template>
          </v-list>
        </div>
      </v-navigation-drawer>
      <div>
        <Nuxt />
      </div>
    </v-main>
  </v-app>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    selectedProjectSafe: {
      get () {
        return this.selectedProject || {}
      },
      set (value) {
        this.$store.commit('user/SET_SELECTED_PROJECT_ID', value.id)
        if (!window.location.pathname.includes('mine')) {
          const newUrl = window.location.pathname.replace(/[1-9]+/, value.id)
          this.$router.push(newUrl)
        }
      }
    },
    showSidebarSafe: {
      get () {
        return this.showSidebar
      },
      set (value) {
        this.$store.commit('preferences/SET_SHOW_SIDEBAR', value)
      }
    },
    menus () {
      const selectedProjectMenus = this.selectedProjectSafe.menus || []
      const menus = [...selectedProjectMenus]
      if (this.user?.isAdmin) {
        menus.push({
          icon: 'mdi-web',
          text: 'Organizaciones',
          to: '/organizations'
        })
      }
      if (this.user?.role === 'Owner') {
        menus.push({
          icon: 'mdi-domain',
          text: 'Mi Organización',
          to: `/organization/${this.user.organizationId}/mine`
        })
      }
      menus.push({
        icon: 'mdi-account',
        text: 'Perfil',
        to: '/profile'
      })
      return menus
    },
    ...mapGetters('user', ['selectedProject']),
    ...mapState('navigation', ['pageTitle', 'canGoBack']),
    ...mapState('preferences', ['showSidebar']),
    ...mapState('user', ['user', 'isLoadingUser', 'projectMenus'])
  },
  created () {
    this.$store.dispatch('user/getUser')
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
}
</script>
