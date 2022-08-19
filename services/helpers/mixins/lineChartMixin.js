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
        return 'labels' in chartData &&
      'datasets' in chartData &&
      chartData.datasets instanceof Object &&
      'label' in chartData.datasets &&
      'data' in chartData.datasets &&
      'backgroundColor' in chartData.datasets &&
      'borderColor' in chartData.datasets &&
      'borderWidth' in chartData.datasets &&
      'pointBackgroundColor' in chartData.datasets &&
      'pointBorderColor' in chartData.datasets &&
      'tension' in chartData.datasets
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
          bottom: 10,
          top: 5
        }
      }
    }
  })
}
