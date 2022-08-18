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
    },
    // Object attr: labels and datasets (bgColor, data)
    chartData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chartOptions: {
        responsive: true,
        hoverOffset: 4
      }
    }
  }
}
</script>
