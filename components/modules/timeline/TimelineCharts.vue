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
      <v-col xl="6" cols="12">
        <ShChartCard
          title="ID de eventos detectados"
          description="Cantidad de eventos independientes detectados en la evidencia analizada. Dichos eventos representan las acciones de los usuarios dentro de los equipos involucrados en la investigación."
        >
          <ShVerticalBarChart
            :chart-data="{
              labels: ['Eventos'],
              datasets: Object.values(amountPerEvent)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="6" cols="12">
        <ShChartCard
          title="Vulnerabilidades detectadas"
          description="Potenciales intentos de explotación de vulnerabilidades asociadas a distintos patrones de ataque reconocidos por la plataforma de inteligencia MITRE ATT&CK."
        >
          <ShHorizontalBarChart
            :chart-data="{
              labels: ['Vulnerabilidades'],
              datasets: Object.values(amountPerVulnerability)
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="6" cols="12">
        <ShChartCard
          title="Direcciones IP detectadas"
          description="Representación de las direcciones IP que establecieron conexiones entrantes y salientes en los equipos analizados."
        >
          <ShPieChart
            :chart-data="{
              labels: ['plopez', 'mrey', 'jmiranda'],
              datasets: [{
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                borderColor: 'white',
                data: [40,20,30]
              }]
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="6" cols="12">
        <ShChartCard
          title="Usuarios detectados"
          description="Representación de los usuarios que realizaron actividades sospechosas en los equipos analizados."
        >
          <ShDoughnutChart
            :chart-data="{
              labels: ['plopez', 'mrey', 'jmiranda'],
              datasets: [{
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                borderColor: 'white',
                data: [40,20,30]
              }]
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="6" cols="12">
        <ShChartCard
          title="Cronología de eventos"
          description="Representación de los eventos analizados a lo largo del tiempo."
        >
          <ShLineChart
            :chart-data="{
              labels: ['plopez', 'mrey', 'jmiranda'],
              datasets: [{
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'blue',
                pointBorderColor: 'blue',
                tension: 0.1,
                data: [40,20,30]
              }]
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col xl="6" cols="12">
        <ShChartCard
          title="TBD"
          description="TBD"
        >
          <ShAreaChart
            :chart-data="{
              labels: ['plopez', 'mrey', 'jmiranda'],
              datasets: [{
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'blue',
                pointBorderColor: 'blue',
                tension: 0.1,
                data: [40,20,30]
              }]
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
