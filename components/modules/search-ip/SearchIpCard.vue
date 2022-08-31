<template>
  <v-row no-gutters>
    <v-col cols="4" lg="4" md="6" sm="8">
      <v-card
        :color="reputation.cardColor"
        flat
      >
        <v-card-text class="py-2">
          <div class="pa-4">
            <div>
              <ShBodySmall neutral>
                La reputación de la IP es
              </ShBodySmall>
              <ShBodySmall strong :class="reputation.textClass">
                {{ `${ip.reputation}%` }}
              </ShBodySmall>
            </div>
            <div>
              <ShHeading1>
                {{ ip.raw }}
                <ShBodySmall strong :class="reputation.textClass">
                  {{ reputation.text }}
                </ShBodySmall>
              </ShHeading1>
            </div>
            <v-row no-gutters class="my-2">
              <v-col>
                <div>
                  <ShBodySmall neutral>
                    País
                  </ShBodySmall>
                </div>
                <div>
                  <ShBodySmall neutral strong class="mr-1">
                    {{ ip.country || 'País no encontrado' }}
                  </ShBodySmall>
                </div>
              </v-col>
              <v-col>
                <div>
                  <ShBodySmall neutral>
                    Ciudad
                  </ShBodySmall>
                </div>
                <div>
                  <ShBodySmall neutral strong>
                    {{ ip.city || 'Ciudad no encontrada' }}
                  </ShBodySmall>
                </div>
              </v-col>
            </v-row>
            <v-divider />
            <v-row no-gutters class="my-2">
              <v-col>
                <div>
                  <ShBodySmall neutral>
                    ISP
                  </ShBodySmall>
                </div>
                <div>
                  <ShBodySmall neutral strong class="mr-1">
                    {{ ip.ISP || 'ISP no encontrado' }}
                  </ShBodySmall>
                </div>
              </v-col>
              <v-col>
                <div>
                  <ShBodySmall neutral>
                    ASN
                  </ShBodySmall>
                </div>
                <div>
                  <ShBodySmall neutral strong>
                    {{ ip.ASN || 'ASN no encontrado' }}
                  </ShBodySmall>
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col>
                <div>
                  <ShBodySmall neutral>
                    TOR
                  </ShBodySmall>
                </div>
                <div>
                  <ShBodySmall neutral strong>
                    {{ ip.isTor ? 'Si' : 'No' }}
                  </ShBodySmall>
                </div>
              </v-col>
              <v-col>
                <div>
                  <ShBodySmall neutral>
                    VPN
                  </ShBodySmall>
                </div>
                <div>
                  <ShBodySmall neutral strong>
                    {{ ip.VPN ? 'Si' : 'No' }}
                  </ShBodySmall>
                </div>
              </v-col>
            </v-row>
            <v-divider />
            <div class="my-2">
              <ShBodySmall neutral strong>
                Puertos abiertos
              </ShBodySmall>
              <br>
              <ShBodySmall v-if="ip.ports.length === 0" neutral>
                No posee
              </ShBodySmall>
              <ShChip
                v-for="(port, portIndex) in ip.ports"
                v-else
                :key="portIndex"
                class="my-1 mr-1"
                small
                color="note1"
              >
                {{ port }}
              </ShChip>
            </div>
            <v-divider />
            <div class="mt-2">
              <div v-if="!reputation.isReported">
                <div class="mt-2">
                  <div class="d-flex justify-space-between">
                    <ShBodySmall neutral strong>
                      {{ `Reportes (${ip.totalReports})` }}
                    </ShBodySmall>
                    <v-icon color="neutral base" @click="toggleShowReports">
                      {{ showReports ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                  </div>
                  <div v-show="showReports" class="sh-scrollbar mh-200-px mt-2">
                    <div v-for="(report, index) in ip.reports" :key="index" class="mt-10 justify-comment">
                      <ShBodySmall neutral strong>
                        {{ report.reportedAt | date }}
                      </ShBodySmall>
                      <ShShowMoreLessText
                        :text="report.comment || 'No comments.'"
                        :characters-to-show="70"
                      />
                      <ShChip v-for="(category, index2) in report.categories" :key="index2" class="mr-2" small color="note1">
                        {{ category }}
                      </ShChip>
                      <v-divider class="my-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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
    showReports: false,
    loading: false
  }),
  computed: {
    reputation () {
      if (this.ip.reputation < 20) {
        return { isReported: true, text: 'Sin Reportes', cardColor: '#E4F5E5', textClass: 'success-text' }
      } else {
        return { isReported: false, text: 'Reportada', cardColor: '#FFF0EC', textClass: 'error-text' }
      }
    }
  },
  methods: {
    toggleShowReports () {
      this.showReports = !this.showReports
    }
  }
}
</script>
<style scoped>
.justify-comment{
  text-align: justify;
  text-justify: inter-word
}
</style>
