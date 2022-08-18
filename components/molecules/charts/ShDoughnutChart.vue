<template>
  <Doughnut
    :chart-options="chartOptions"
    :chart-data="chartData"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Doughnut } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
  name: 'DoughnutChart',
  components: { Doughnut },
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    chartData: {
      type: Object,
      required: true,
      validator (chartData) {
        return 'labels' in chartData &&
      'datasets' in chartData &&
      chartData.datasets instanceof Object &&
      'data' in chartData.datasets &&
      'backgroundColor' in chartData.datasets
      }
    }
  },
  data () {
    return {
      chartOptions: {
        responsive: true,
        hoverOffset: 4,
        cutout: '50%'
      }
    }
  }
}
</script>
