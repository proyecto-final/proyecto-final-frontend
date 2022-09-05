<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartDataWithColors"
    :width="width"
    :height="height"
  />
</template>
<script>
import barChartMixin from '@/services/helpers/mixins/barChartMixin'
export default {
  mixins: [barChartMixin]
}
</script>
