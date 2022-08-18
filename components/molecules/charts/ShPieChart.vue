<template>
  <Pie
    :chart-options="chartOptions"
    :chart-data="chartData"
    :width="width"
    :height="height"
  />
</template>

<script>
import pieChartMixin from '@/services/helpers/mixins/pieChartMixin'

export default {
  mixins: [pieChartMixin]
}
</script>
