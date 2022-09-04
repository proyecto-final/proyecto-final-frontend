<template>
  <ChartLine
    :chart-options="chartOptions"
    :chart-data="chartDataWithColors"
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
