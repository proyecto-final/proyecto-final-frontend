<template>
  <ShDialog v-model="show" :title="`IP Analizada ${ip.raw}`" width="600">
    <template #activator="{on: dialogOn}">
      <v-tooltip top class="mr-2">
        <template #activator="{on}">
          <span v-on="on" @click="dialogOn.click">
            <ShChip
              class="mx-1 clickable"
              :color="ip.reputation < 20 ? 'success' : 'error'"
            >
              <v-icon>
                mdi-shield-search
              </v-icon>
              {{ `IP ${ip.raw}` }}
            </ShChip>
          </span>
        </template>
        <template #default>
          {{ ip.raw }}
        </template>
      </v-tooltip>
    </template>
    <template #default>
      <SearchIpCard :ip="ip" class="mb-6" />
    </template>
  </ShDialog>
</template>
<script>
export default {
  props: {
    ip: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    show: false
  }),
  methods: {
    getColorFromLevel (level) {
      return {
        low: 'success',
        medium: 'warning',
        high: 'error'
      }[level] || 'gray'
    }
  }
}
</script>
