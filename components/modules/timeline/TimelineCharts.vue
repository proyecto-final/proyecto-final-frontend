<template>
  <v-row>
    <v-col class="d-flex justify-center">
      <ShChartCard
        title="Eventos detectados"
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
        title="Vulnerabilidades detectada"
        description="Potenciales intentos de explotación de vulnerabilidades conocidas y asociadas a distintos patrones de ataque reconocidos por la plataforma de inteligencia MITRE ATT&CK"
      >
        <ShPieChart
          :chart-data="{
            labels: ['plopez', 'mrey', 'jmiranda'],
            datasets: [{
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
        description="Potenciales intentos de explotación de vulnerabilidades asociadas a distintos patrones de ataque reconocidos por la plataforma de inteligencia MITRE ATT&CK"
      >
        <ShDoughnutChart
          :chart-data="{
            labels: ['plopez', 'mrey', 'jmiranda'],
            datasets: [{
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
        description="Potenciales intentos de explotación de vulnerabilidades asociadas a distintos patrones de ataque reconocidos por la plataforma de inteligencia MITRE ATT&CK"
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
        title="Vulnerabilidades detectada"
        description="Potenciales intentos de explotación de vulnerabilidades asociadas a distintos patrones de ataque reconocidos por la plataforma de inteligencia MITRE ATT&CK"
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
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}

</script>
