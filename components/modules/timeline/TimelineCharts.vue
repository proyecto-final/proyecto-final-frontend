<template>
  <div>
    <v-card class="w-100 pa-4 my-6" flat outlined>
      <div>
        <ShHeading1>
          Reportes
        </ShHeading1>
        <ShBodySmall neutral>
          En esta sección podrás analizar la información recabada por chainsaw y realizar filtros para poder obtener mayor información sobre los eventos analizados.
        </ShBodySmall>
      </div>
      <v-row class="mt-2">
        <v-col cols="12" md="4" lg="3">
          <ShDatePicker
            v-model="filter.dates"
            hide-details
            clearable
            range
            placeholder="Filtrar por fecha"
          />
        </v-col>
      </v-row>
    </v-card>
    <v-row>
      <v-col xl="3" cols="6">
        <ShChartCard
          title="ID de eventos detectados"
          description="Cantidad de eventos independientes detectados en la evidencia analizada. Dichos eventos representan las acciones de los usuarios dentro de los equipos involucrados en la investigación."
        >
          <ShVerticalBarChart
            :chart-data="{
              labels: [''],
              datasets: Object.values(amountPerEvent)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="3" cols="6">
        <ShChartCard
          title="Vulnerabilidades detectadas"
          description="Potenciales intentos de explotación de vulnerabilidades asociadas a distintos patrones de ataque reconocidos por la plataforma de inteligencia MITRE ATT&CK."
        >
          <ShHorizontalBarChart
            :color-offset="6"
            :chart-data="{
              labels: [''],
              datasets: Object.values(amountPerVulnerability)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="3" cols="6">
        <ShChartCard
          title="Criticidad de vulnerabilidades"
          description="Representación del nivel de severidad e impacto que involucran las vulnerabilidades halladas en los eventos."
        >
          <ShPieChart
            :chart-data="{
              labels: [''],
              datasets: Object.values(amountPerCriticality)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="3" cols="6">
        <ShChartCard
          title="Usuarios detectados"
          description="Representación de los usuarios que realizaron actividades sospechosas en los equipos analizados."
        >
          <ShPieChart
            :chart-data="{
              labels: [''],
              datasets: Object.values(amountPerUser)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="3" cols="6">
        <ShChartCard
          title="Direcciones IP origen detectadas"
          description="Representación de las direcciones IP origen halladas en los equipos analizados. La dirección IP origen refleja el dispositivo en el cual se genera la conexión o envío de paquete."
        >
          <ShDoughnutChart
            :chart-data="{
              labels: [''],
              datasets: Object.values(amountPerSrcIp)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="3" cols="6">
        <ShChartCard
          title="Direcciones IP destino detectadas"
          description="Representación de las direcciones IP destino halladas en los equipos analizados. La dirección IP destino refleja el dispositivo al cual se efectuó una conexión o envío de paquete."
        >
          <ShDoughnutChart
            :chart-data="{
              labels: [''],
              datasets: Object.values(amountPerDstIp)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="3" cols="12">
        <ShChartCard
          title="Cronología de eventos"
          description="Representación de los eventos analizados a lo largo del tiempo."
        >
          <ShLineChart
            :chart-data="{
              labels: [''],
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
      dates: []
    }
  }),
  computed: {
    filteredLogLines () {
      // TODO: make the filters work here
      return this.logLines
    },
    amountPerEvent () {
      // TODO: definir que hacer con eventos de .logs
      const getIdentifier = line => line.detail?.eventId?.toString()
      return this.filteredLogLines.reduce((countPerEvent, line) => {
        const identifier = getIdentifier(line)
        if (!countPerEvent[identifier]) {
          countPerEvent[identifier] = { data: 0, label: identifier }
        }
        countPerEvent[identifier].data++
        return countPerEvent
      }, {})
    },
    vulnerabilities () {
      return this.logLines.map(line => line.vulnerabilites).flat()
    },
    amountPerVulnerability () {
      const getIdentifier = vulnerability => vulnerability._id
      return this.vulnerabilities.reduce((countPerEvent, vulnerability) => {
        const identifier = getIdentifier(vulnerability)
        if (!countPerEvent[identifier]) {
          countPerEvent[identifier] = { data: 0, label: vulnerability.name }
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
      return this.filteredLogLines.reduce((countPerEvent, line) => {
        const identifier = getIdentifier(line)
        if (!countPerEvent[identifier]) {
          countPerEvent[identifier] = { data: 0, label: identifier }
        }
        countPerEvent[identifier].data++
        return countPerEvent
      }, {})
    },
    amountPerSrcIp () {
      const getIdentifier = line => line.detail?.sourceIp || 'Sin identificar'
      return this.filteredLogLines.reduce((countPerEvent, line) => {
        const identifier = getIdentifier(line)
        if (!countPerEvent[identifier]) {
          countPerEvent[identifier] = { data: 0, label: identifier }
        }
        countPerEvent[identifier].data++
        return countPerEvent
      }, {})
    },
    amountPerDstIp () {
      const getIdentifier = line => line.detail?.destinationIp || 'Sin identificar'
      return this.filteredLogLines.reduce((countPerEvent, line) => {
        const identifier = getIdentifier(line)
        if (!countPerEvent[identifier]) {
          countPerEvent[identifier] = { data: 0, label: identifier }
        }
        countPerEvent[identifier].data++
        return countPerEvent
      }, {})
    },
    amountPerInterval () {
      // TODO: en base a filtros cambiar intervalo
      const getIntervalValue = date => `${new Date(date).toDateString()} - Hora:${new Date(date).getHours()}`
      return this.filteredLogLines.reduce((countPerEvent, line) => {
        const interval = getIntervalValue(line.timestamp)
        if (!countPerEvent[interval]) {
          countPerEvent[interval] = { data: 0, label: interval }
        }
        countPerEvent[interval].data++
        return countPerEvent
      }, {})
    }
  }
}
</script>
