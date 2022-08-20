<template>
  <div>
    <v-row class="mt-3">
      <v-col cols="12" md="6" lg="4">
        <ShDatePicker
          v-model="filter.dates"
          hide-details
          clearable
          range
          placeholder="Filtrar por fecha"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <ShChartCard
          title="ID de eventos detectados"
          description="Cantidad de eventos independientes detectados en la evidencia analizada. Dichos eventos representan las acciones de los usuarios dentro de los equipos involucrados en la investigación."
        >
          <ShVerticalBarChart
            :chart-data="{
              labels: ['Jan', 'Feb', 'Mar'],
              datasets: [{
                label: '',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                borderColor: 'rgb(54, 162, 235)',
                data: [40,20,30]
              }]
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col class="d-flex justify-center">
        <ShChartCard
          title="Vulnerabilidades detectada"
          description="Potenciales intentos de explotación de vulnerabilidades asociadas a distintos patrones de ataque reconocidos por la plataforma de inteligencia MITRE ATT&CK."
        >
          <ShHorizontalBarChart
            :chart-data="{
              labels: ['plopez', 'mrey', 'jmiranda'],
              datasets: [{
                label: '',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                borderColor: 'rgb(54, 162, 235)',
                data: [40,20,30]
              }]
            }"
          />
        </ShChartCard>
      </v-col>
      <v-col class="d-flex justify-center">
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
      <v-col class="d-flex justify-center">
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
      <v-col class="d-flex justify-center">
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
      <v-col class="d-flex justify-center">
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
  watch: {
    'filter.dates': {
      handler (dates) {
        if ([0, 2].includes(dates?.length)) {
          this.fetchDebounced()
        }
      },
      deep: true
    }
  }
}

</script>
