<template>
  <Doughnut
    :chart-options="chartOptionsToShow"
    :chart-data="chartDataWithColors"
    :width="width"
    :height="height"
  />
</template>
<script>
import { Doughnut } from 'vue-chartjs/legacy'
import pieChartMixin from '@/services/helpers/mixins/pieChartMixin'
export default {
  name: 'DoughnutChart',
  components: { Doughnut },
  mixins: [pieChartMixin],
  computed: {
    chartOptionsToShow () {
      return { ...this.chartOptions, cutout: '50%' }
    }
  }
}
</script>
