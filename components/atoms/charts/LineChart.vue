<template>
  <ChartLine
    :chart-options="chartOptions"
    :chart-data="chartData"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Line as ChartLine } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  name: 'LineChart',
  components: { ChartLine },
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
        labels: ['January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July'
        ],
        datasets: [{
          label: 'Puerto 433',
          data: [2, 10, 5, 9, 0, 6, 3],
          backgroundColor: 'transparent',
          borderColor: '#069BFF',
          borderWidth: 1,
          pointBackgroundColor: '#069BFF',
          pointBorderColor: '#069BFF',
          tension: 0.1
        }]

      },
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>
