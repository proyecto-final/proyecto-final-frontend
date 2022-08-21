import { Line as ChartLine } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  name: 'LineChart',
  components: { ChartLine },
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    // Should be default borderWidth: 1 and tension: 0.1
    chartData: {
      type: Object,
      required: true,
      validator (chartData) {
        const datasetAttributes = ['label', 'data', 'backgroundColor', 'borderColor', 'borderWidth', 'tension', 'pointBackgroundColor', 'pointBorderColor']
        return 'labels' in chartData &&
      'datasets' in chartData &&
      Array.isArray(chartData.datasets) &&
      chartData.datasets
        .every(dataset => datasetAttributes.every(attribute => attribute in dataset))
      }
    }
  },
  data: () => ({
    chartOptions: {
      responsive: true,
      layout: {
        padding: {
          left: 30,
          right: 30,
          bottom: 30,
          top: 30
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}
