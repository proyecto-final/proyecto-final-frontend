<template>
  <div>
    <v-card class="w-100 pa-4 my-6" flat>
      <div>
        <ShHeading1>
          Reportes
        </ShHeading1>
        <ShBodySmall neutral>
          En esta sección podrás analizar la información recabada por chainsaw y realizar filtros para poder obtener mayor información sobre los eventos analizados.
        </ShBodySmall>
      </div>
      <v-row class="mt-2">
        <v-col cols="4">
          <ShDatePicker
            v-model="filter.dates"
            hide-details
            clearable
            range
            placeholder="Filtrar por fecha"
          />
        </v-col>
        <v-col cols="4">
          <ShAutocomplete
            v-model="filter.ips"
            hide-details
            clearable
            multiple
            :items="availableIps"
            placeholder="Filtrar por IPs"
          >
            <template #selection="{index}">
              <span v-if="index === 0">
                {{ cutTo(filter.ips.join(', '), 16) }}
              </span>
            </template>
          </ShAutocomplete>
        </v-col>
        <v-col cols="4">
          <ShAutocomplete
            v-model="filter.users"
            hide-details
            clearable
            multiple
            :items="availableUsers"
            placeholder="Filtrar por usuarios"
          >
            <template #selection="{index}">
              <span v-if="index === 0">
                {{ cutTo(filter.users.join(', '), 13) }}
              </span>
            </template>
          </ShAutocomplete>
        </v-col>
      </v-row>
    </v-card>
    <v-row>
      <v-col cols="6">
        <ShChartCard
          title="ID de eventos detectados"
          description="Cantidad de eventos independientes detectados en la evidencia analizada. Dichos eventos representan las acciones de los usuarios dentro de los equipos involucrados en la investigación."
        >
          <ShVerticalBarChart
            :chart-data="{
              datasets: Object.values(amountPerEvent)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col cols="6">
        <ShChartCard
          title="Vulnerabilidades detectadas"
          description="Potenciales intentos de explotación de vulnerabilidades asociadas a distintos patrones de ataque reconocidos por la plataforma de inteligencia MITRE ATT&CK."
        >
          <ShHorizontalBarChart
            :color-offset="6"
            :chart-data="{
              datasets: Object.values(amountPerVulnerability)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col cols="6">
        <ShChartCard
          title="Criticidad de vulnerabilidades"
          description="Representación del nivel de severidad e impacto que involucran las vulnerabilidades halladas en los eventos."
        >
          <ShPieChart
            :chart-data="{
              datasets: Object.values(amountPerCriticality)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col cols="6">
        <ShChartCard
          title="Usuarios detectados"
          description="Representación de los usuarios que realizaron actividades sospechosas en los equipos analizados."
        >
          <ShPieChart
            :chart-data="{
              datasets: Object.values(amountPerUser)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col cols="6">
        <ShChartCard
          title="Direcciones IP origen detectadas"
          description="Representación de las direcciones IP origen halladas en los equipos analizados. La dirección IP origen refleja el dispositivo en el cual se genera la conexión o envío de paquete."
        >
          <ShDoughnutChart
            :chart-data="{
              datasets: Object.values(amountPerSrcIp)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col cols="6">
        <ShChartCard
          title="Direcciones IP destino detectadas"
          description="Representación de las direcciones IP destino halladas en los equipos analizados. La dirección IP destino refleja el dispositivo al cual se efectuó una conexión o envío de paquete."
        >
          <ShDoughnutChart
            :chart-data="{
              datasets: Object.values(amountPerDstIp)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col cols="12">
        <ShChartCard
          title="Cronología de eventos"
          description="Representación de los eventos analizados a lo largo del tiempo."
        >
          <div class="d-flex">
            <ShBodySmall class="d-flex align-center mr-3" neutral>
              Agrupar eventos según:
            </ShBodySmall>
            <v-radio-group v-model="selectedInterval" class="small-radio" row>
              <v-radio
                :ripple="false"
                value="day"
              >
                <template #label>
                  <ShBodySmall neutral>
                    Día
                  </ShBodySmall>
                </template>
              </v-radio>
              <v-radio
                :ripple="false"
                value="hour"
              >
                <template #label>
                  <ShBodySmall neutral>
                    Hora
                  </ShBodySmall>
                </template>
              </v-radio>
              <v-radio
                :ripple="false"
                value="minute"
              >
                <template #label>
                  <ShBodySmall neutral>
                    Minuto
                  </ShBodySmall>
                </template>
              </v-radio>
            </v-radio-group>
          </div>
          <ShLineChart
            :chart-data="{
              datasets: Object.values(amountPerInterval)
            }"
          />
        </ShChartCard>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    logLines: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    filter: {
      dates: [],
      ips: [],
      users: []
    },
    selectedInterval: 'day'
  }),
  computed: {
    filteredLogLines () {
      const dateFrom = this.filter.dates[0] < this.filter.dates[1] ? this.filter.dates[0] : this.filter.dates[1]
      const dateTo = this.filter.dates[0] > this.filter.dates[1] ? this.filter.dates[0] : this.filter.dates[1]
      return this.logLines
        .filter(logLine => (!dateFrom || logLine.timestamp >= dateFrom) && (!dateTo || logLine.timestamp <= dateTo))
        .filter(logLine => (!this.filter.users.length || this.filter.users.includes(logLine.detail?.userName)))
        .filter(logLine => (!this.filter.ips.length || this.filter.ips.includes(logLine.detail?.sourceIp) || this.filter.ips.includes(logLine.detail?.destinationIp)))
    },
    amountPerEvent () {
      // TODO: definir que hacer con eventos de .logs
      const getIdentifier = line => line.detail?.eventId?.toString()
      return this.countEvents(this.filteredLogLines, getIdentifier)
    },
    vulnerabilities () {
      return this.filteredLogLines.map(line => line.vulnerabilites).flat()
    },
    amountPerVulnerability () {
      const getIdentifier = vulnerability => vulnerability._id
      return this.vulnerabilities.reduce((countPerEvent, vulnerability) => {
        const identifier = getIdentifier(vulnerability)
        if (!countPerEvent[identifier]) {
          const vulnerabilityName = this.cutTo(vulnerability.name, 45)
          countPerEvent[identifier] = { data: 0, label: vulnerabilityName }
        }
        countPerEvent[identifier].data++
        return countPerEvent
      }, {})
    },
    amountPerCriticality () {
      return this.vulnerabilities.reduce((countPerEvent, vulnerability) => {
        const identifier = vulnerability.level
        if (!countPerEvent[identifier]) {
          countPerEvent[identifier] = { data: 0, label: vulnerability.level }
        }
        countPerEvent[identifier].data++
        return countPerEvent
      }, {})
    },
    amountPerUser () {
      const getIdentifier = line => line.detail?.userId || line.detail?.userName || 'Sin identificar'
      return this.countEvents(this.filteredLogLines, getIdentifier)
    },
    amountPerSrcIp () {
      const getIdentifier = line => line.detail?.sourceIp || 'Sin identificar'
      return this.countEvents(this.filteredLogLines, getIdentifier)
    },
    amountPerDstIp () {
      const getIdentifier = line => line.detail?.destinationIp || 'Sin identificar'
      return this.countEvents(this.filteredLogLines, getIdentifier)
    },
    amountPerInterval () {
      const getIntervalFunction = {
        hour: date => `${new Date(date).toLocaleDateString()} - ${new Date(date).getHours()}`,
        minute: date => `${new Date(date).toLocaleDateString()} - ${new Date(date).getHours()}:${new Date(date).getMinutes()}`,
        day: date => `${new Date(date).toLocaleDateString()}`
      }
      return this.filteredLogLines.reduce((countPerEvent, line) => {
        const interval = getIntervalFunction[this.selectedInterval](line.timestamp)
        if (!countPerEvent[interval]) {
          countPerEvent[interval] = { data: 0, label: interval }
        }
        countPerEvent[interval].data++
        return countPerEvent
      }, {})
    },
    availableIps () {
      return Array.from(new Set(this.logLines.map(line => [line.detail?.sourceIp, line.detail?.destinationIp]).flat().filter(v => v)))
    },
    availableUsers () {
      return Array.from(new Set(this.logLines.map(line => [line.detail?.userName]).flat().filter(v => v)))
    }
  },
  methods: {
    countEvents (list, getIdentifierFunc) {
      return list.reduce((countPerEvent, line) => {
        const identifier = getIdentifierFunc(line)
        if (!countPerEvent[identifier]) {
          countPerEvent[identifier] = { data: 0, label: identifier }
        }
        countPerEvent[identifier].data++
        return countPerEvent
      }, {})
    },
    cutTo (str, length) {
      return str.length > length ? `${str.substr(0, length - 3)}...` : str
    }
  }
}
</script>
<style scoped>
::v-deep .small-radio i {
  font-size: 19px;
}
</style>
