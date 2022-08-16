<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
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
        labels: ['May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Logins jperez',
          backgroundColor: '#FF4069',
          data: [40, 20, 10]
        },
        {
          label: 'Logins hgomez',
          backgroundColor: '#069BFF',
          data: [25, 10, 5]
        }]
      },
      chartOptions: {
        responsive: true,
        indexAxis: 'y'
      }
    }
  }
}
</script>
