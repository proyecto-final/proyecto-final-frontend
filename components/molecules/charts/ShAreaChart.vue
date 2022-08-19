<template>
  <ChartLine
    :chart-options="chartOptions"
    :chart-data="chartDataToShow"
    :width="width"
    :height="height"
  />
</template>
<script>
import lineChartMixin from '@/services/helpers/mixins/lineChartMixin'

export default {
  mixins: [lineChartMixin],
  data: () => ({
    chartOptions: {
      ...lineChartMixin.chartOptions,
      plugins: {
        filler: {
          propagate: false,
          drawTime: 'beforeDraw'
        }
      }
    }
  }),
  computed: {
    chartDataToShow () {
      return { ...this.chartData, fill: true }
    }
  }
}
</script>
