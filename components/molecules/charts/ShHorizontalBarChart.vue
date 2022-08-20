<template>
  <Bar
    :chart-options="chartOptionsToShow"
    :chart-data="chartData"
    :width="width"
    :height="height"
  />
</template>
<script>
import barChartMixin from '@/services/helpers/mixins/barChartMixin'

export default {
  mixins: [barChartMixin],
  computed: {
    chartOptionsToShow () {
      return { ...this.chartOptions, indexAxis: 'y' }
    }
  }
}
</script>
