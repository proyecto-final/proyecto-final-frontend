<template>
  <v-row>
    <v-col class="d-flex justify-center">
      <ShChartCard
        title="Eventos detectados"
        description="Cantidad de eventos independientes detectados en el log"
      >
        <ShVerticalBarChart
          :chart-data="{
            labels: ['Jan', 'Feb', 'Mar'],
            datasets: [{
              label: 'Login lperez',
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
        title="Login de usuarios"
        description="Intentos de login de usuarios sospechosos"
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
