<template>
  <v-row justify="center" class="h-100">
    <v-col cols="12" sm="10" md="9" class="d-flex align-center">
      <v-card elevation="0" class="w-100">
        <v-card-text class="pa-8">
          <template v-if="loading">
            <v-progress-circular color="primary" indeterminate />
            <ShBody>Procesando invitación...</ShBody>
          </template>
          <template v-else-if="isValidToken">
            <div class="mb-4">
              <ShHeading3 neutral>
                Reporte Compartido
              </ShHeading3>
            </div>
            <div class="d-flex justify-center mb-8">
              <div>
                <ShDisplayXL neutral>
                  {{ timeline.title }}
                </ShDisplayXL>
              </div>
            </div>
            <TimelinePreviewStats
              :lines2-show="timeline.lines"
              is-read-only
              :timeline-description="timeline.description"
              :log-lines-count="timeline.lines.length"
              :vulnerabilites="timeline.lines.map(line => line.vulnerabilites).flat()"
            />
          </template>
          <template v-else>
            <div class="d-flex justify-center">
              <v-icon x-large color="primary">
                mdi-robot-confused
              </v-icon>
            </div>
            <div class="my-2">
              <ShHeading2>Enlace de invitación inválido</ShHeading2>
            </div>
            <div>
              <ShBody>
                El enlace de invitación utilizado no es válido, por favor
                contáctese con su administrador para generar uno nuevo
              </ShBody>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'login',
  data: () => ({
    timeline: {},
    loading: false,
    isValidToken: false
  }),
  computed: {
    token () {
      return this.$route.params.token
    }
  },
  created () {
    this.loading = true
    this.$timelineService.getByToken(this.token)
      .then((response) => {
        this.timeline = response
        this.isValidToken = true
      }).catch(() => {
        this.isValidToken = false
      }).finally(() => { this.loading = false })
  }
}
</script>
