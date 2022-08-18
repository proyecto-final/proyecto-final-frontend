<template>
  <ChartLine
    :chart-options="chartOptions"
    :chart-data="chartData"
    :width="width"
    :height="height"
  />
</template>
<script>
import lineChartMixin from '@/services/helpers/mixins/lineChartMixin'

export default {
  mixins: [lineChartMixin]
}
</script>
