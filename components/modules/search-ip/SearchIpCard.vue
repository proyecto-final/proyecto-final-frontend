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
          <div>
            <div v-if="!showReports">
              <ShBodySmall neutral strong>
                {{ `Reportes (${ip.reports})` }}
              </ShBodySmall>
              <v-icon color="neutral base" class="float-right" @click="getReports">
                mdi-chevron-down
              </v-icon>
            </div>
            <div v-else class="mt-2">
              <ShBodySmall neutral strong>
                {{ `Reportes (${ip.reports})` }}
              </ShBodySmall>
              <v-icon color="neutral base" class="float-right" @click="getReports">
                mdi-chevron-up
              </v-icon>
              <div v-for="(report, index) in reports" :key="index" class="justify-comment">
                <ShBodySmall neutral strong>
                  {{ report.date }}
                </ShBodySmall>
                <br>
                <ShShowMoreLessText
                  :text="report.comment"
                  :characters-to-show="70"
                />
                <ShChip v-for="(category, index2) in report.categories" :key="index2" class="mt-3 mr-2" small color="note1">
                  {{ category }}
                </ShChip>
                <v-divider class="my-4" />
              </div>
            </div>
          </div>
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
  },
  data: () => ({
    reports: [{ date: '47 seconds', comment: ' Aug 23 05:39:48 ns03 sshd[941662]: Failed password for root from 61.177.173.37 port 60239 ssh2 Aug 23 05:39:50 ns03 sshd[941662]: Failed password for root from 61.177.173.37 port 60239 ssh2 Aug 23 05:39:52 ns03 sshd[941666]: pam_unix(sshd:auth): authentication failure logname= uid=0 euid=0 tty=ssh ruser= rhost=61.177.173.37 user=root Aug 23 05:39:55 ns03 sshd[941666]: Failed password for root from 61.177.173.37 port 21499 ssh2 Aug 23 05:39:58 ns03 sshd[941666]: Failed password for root from 61.177.173.37 port 21499 ssh2', categories: ['Brute Force', 'SSH'] },
      { date: '24 minutes ago', comment: 'Unauthorized connection attempt detected from IP address 61.177.173.37 to port 22 (warsaw) [p]', categories: ['Brute Force', 'Exploited Host'] }],
    options: {
      page: 1,
      itemsPerPage: 10
    },
    showReports: false,
    headers: [
      {
        text: 'Fecha',
        value: 'date'
      },
      {
        text: 'Comentario',
        value: 'comment'
      },
      {
        text: 'Categorías',
        value: 'categories'
      }
    ],
    serverItemsLength: 2,
    loading: false
  }),
  methods: {
    getReports () {
      if (this.showReports) {
        this.showReports = false
      } else {
        this.showReports = true
      }
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
.justify-comment{
  margin-top: 10px;
    text-align: justify;
    text-justify: inter-word
}
</style>
