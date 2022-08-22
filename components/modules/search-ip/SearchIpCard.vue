<template>
  <v-card
    :color="!ip.isReported ? '#E4F5E5' : '#FFF0EC'"
    flat
    class="ml-4 mt-4 w-30"
  >
    <v-card-text class="pa-6">
      <ShBodySmall neutral class="mb-2">
        La reputación de la IP es
        <ShBodySmall strong :class="`${!ip.isReported ? 'green-text' : 'red-text'}`">
          {{ !ip.isReported ? '0%' : `${ip.reputation}%` }}
        </ShBodySmall>
      </ShBodySmall>
      <ShHeading1 class="mb-4 mr-4">
        94.222.32.14
        <ShBodySmall strong :class="`${!ip.isReported ? 'green-text' : 'red-text'}`">
          {{ !ip.isReported ? 'Sin Reportes' : 'Reportada' }}
        </ShBodySmall>
      </ShHeading1>
      <v-row class="my-4 ml-1">
        <v-col>
          <v-row>
            <ShBodySmall neutral>
              País
            </ShBodySmall>
          </v-row>
          <v-row>
            <ShBodySmall neutral strong>
              {{ ip.country }}
            </ShBodySmall>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <ShBodySmall neutral>
              Ciudad
            </ShBodySmall>
          </v-row>
          <v-row>
            <ShBodySmall neutral strong>
              {{ ip.city }}
            </ShBodySmall>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row class="my-4 ml-1">
        <v-col>
          <v-row>
            <ShBodySmall neutral>
              ISP
            </ShBodySmall>
          </v-row>
          <v-row>
            <ShBodySmall neutral strong>
              {{ ip.isp }}
            </ShBodySmall>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <ShBodySmall neutral>
              ASN
            </ShBodySmall>
          </v-row>
          <v-row>
            <ShBodySmall neutral strong>
              {{ ip.asn }}
            </ShBodySmall>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="mt-4 ml-1">
        <v-col>
          <v-row>
            <ShBodySmall neutral>
              TOR
            </ShBodySmall>
          </v-row>
          <v-row>
            <ShBodySmall neutral strong>
              {{ ip.tor ? 'Si' : 'No' }}
            </ShBodySmall>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <ShBodySmall neutral>
              VPN
            </ShBodySmall>
          </v-row>
          <v-row>
            <ShBodySmall neutral strong>
              {{ ip.vpn ? 'Si' : 'No' }}
            </ShBodySmall>
          </v-row>
        </v-col>
      </v-row>
      <template v-if="ip.isReported">
        <v-divider class="mt-8 mb-4" />
        <div>
          <ShBodySmall neutral strong class="ml-1">
            {{ `Reportes (${ip.reports})` }}
          </ShBodySmall>
          <v-icon color="neutral base" class="float-right">
            mdi-chevron-down
          </v-icon>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    ip: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
.green-text{
  color: #086E08;
  vertical-align: middle
}
.red-text{
  color: #E3231D;
  vertical-align: middle
}
</style>
