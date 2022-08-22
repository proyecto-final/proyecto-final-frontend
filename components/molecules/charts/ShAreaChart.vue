<template>
  <ChartLine
    :chart-options="chartOptionsToShow"
    :chart-data="chartDataWithColors"
    :width="width"
    :height="height"
  />
</template>
<script>
import lineChartMixin from '@/services/helpers/mixins/lineChartMixin'

export default {
  mixins: [lineChartMixin],
  computed: {
    chartDataToShow () {
      return { ...this.chartData, fill: true }
    },
    chartOptionsToShow () {
      return {
        ...this.chartOptions,
        plugins: {
          filler: {
            propagate: true,
            drawTime: 'beforeDraw'
          },
          legend: {
            display: false
          }
        }
      }
    }
  }
}
</script>
