import { Pie } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'
import systemColorsMixin from '@/services/helpers/mixins/systemColorsMixin'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
  mixins: [systemColorsMixin],
  name: 'PieChart',
  components: { Pie },
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    chartData: {
      type: Object,
      required: true,
      validator (chartData) {
        return 'labels' in chartData &&
      'datasets' in chartData &&
      Array.isArray(chartData.datasets) &&
      chartData.datasets
        .every(dataset => 'data' in dataset && 'backgroundColor' in dataset)
      }
    }
  },
  computed: {
    chartDataWithColors () {
      return { ...this.chartData, datasets: this.datasetsWithColors }
    },
    datasetsWithColors () {
      return this.chartData.datasets.map((dataset, idx) => {
        return {
          ...dataset,
          data: [dataset.data],
          borderWidth: 1,
          borderColor: 'white',
          backgroundColor: this.getColorForIndex(this.colorOffset + idx)
        }
      })
    }
  },
  data: () => ({
    chartOptions: {
      responsive: true,
      hoverOffset: 4,
      layout: {
        padding: {
          left: 30,
          right: 30,
          bottom: 30,
          top: 10
        }
      }
    }
  })
}
