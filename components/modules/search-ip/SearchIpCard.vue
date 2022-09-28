<template>
  <v-card
    :color="reputation.cardColor"
    flat
  >
    <v-card-text class="py-2">
      <div class="pa-4">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div>
              <ShBodySmall neutral>
                La IP es
              </ShBodySmall>
              <ShBodySmall strong :class="reputation.textClass">
                {{ `${ip.reputation}%` }} maliciosa
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
          </div>
          <div>
            <ShIconButton
              icon="mdi-help-circle"
              :icon-class="reputation.textClass"
              title="Información proveniente de Shodan, AbuseIPDB y TorList"
            />
          </div>
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
                {{ ip.isTor ? 'Sí' : 'No' }}
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
                {{ ip.VPN ? 'Sí' : 'No' }}
              </ShBodySmall>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="ip.ports.length > 0" no-gutters class="mb-2">
          <v-col>
            <div>
              <ShBodySmall neutral>
                Puertos abiertos
              </ShBodySmall>
            </div>
            <div>
              <ShBodySmall neutral strong>
                {{ ip.ports.join(', ') }}
              </ShBodySmall>
            </div>
          </v-col>
        </v-row>
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
                <div
                  v-for="(report, reportIndex) in ip.reports"
                  :key="reportIndex"
                  class="mt-1 justify-comment"
                >
                  <ShBodySmall neutral strong>
                    {{ report.reportedAt | date }}
                  </ShBodySmall>
                  <ShShowMoreLessText
                    :text="report.comment || 'No comments.'"
                    :characters-to-show="70"
                  />
                  <div>
                    <ShBodySmall>
                      Motivo de reporte
                    </ShBodySmall>
                    <SearchIpReportReasonChip
                      v-for="(category, categoryIndex) in report.categories"
                      :key="categoryIndex"
                      :category="category"
                    >
                      {{ category }}
                    </SearchIpReportReasonChip>
                  </div>
                  <v-divider class="my-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    showReports: false,
    loading: false,
    reputationLimit: 20
  }),
  computed: {
    reputation () {
      if (this.ip.reputation < this.reputationLimit) {
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
