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
    },
    // Object attr: labels and datasets (label, bgColor, borderColor, data,
    // borderWidth: 1, pointBgColor, pointBorderColor, tension: 0.1, fill)
    chartData: {
      type: Object,
      required: true
    },
    // Object attr: responsive
    chartOptions: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
