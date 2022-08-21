import { Pie } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
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
