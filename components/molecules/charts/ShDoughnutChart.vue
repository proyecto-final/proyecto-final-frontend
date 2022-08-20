<template>
  <Doughnut
    :chart-options="chartOptionsToShow"
    :chart-data="chartData"
    :width="width"
    :height="height"
  />
</template>
<script>
import pieChartMixin from '@/services/helpers/mixins/pieChartMixin'

export default {
  mixins: [pieChartMixin],
  computed: {
    chartOptionsToShow () {
      return { ...this.chartOptions, cutout: '50%' }
    }
  }
}
</script>
