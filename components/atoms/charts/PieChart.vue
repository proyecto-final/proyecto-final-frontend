<template>
  <Pie
    :chart-options="chartOptions"
    :chart-data="chartData"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Pie } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
  name: 'PieChart',
  components: { Pie },
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    }
  },
  data () {
    return {
      chartData: {
        labels: ['10.1.1.1', '10.10.120.3', '98.145.120.60'],
        datasets: [{
          backgroundColor: ['#FF4069', '#069BFF', '#FFC234'],
          data: [35, 60, 15]
        }]

      },
      chartOptions: {
        responsive: true,
        hoverOffset: 4
      }
    }
  }
}
</script>
