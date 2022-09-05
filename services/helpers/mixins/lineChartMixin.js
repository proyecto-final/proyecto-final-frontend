import { Line as ChartLine } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import systemColorsMixin from '@/services/helpers/mixins/systemColorsMixin'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  mixins: [systemColorsMixin],
  name: 'LineChart',
  components: { ChartLine },
  props: {
    colorOffset: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    },
    chartData: {
      type: Object,
      required: true,
      validator (chartData) {
        const datasetAttributes = ['data']
        return 'datasets' in chartData &&
      Array.isArray(chartData.datasets) &&
      chartData.datasets
        .every(dataset => datasetAttributes.every(attribute => attribute in dataset))
      }
    }
  },
  computed: {
    chartDataWithColors () {
      return { ...this.chartData, labels: this.chartDataLabels, datasets: this.datasetsWithColors }
    },
    datasetsWithColors () {
      return [{
        data: this.chartData.datasets.map(dataset => dataset.data),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 1,
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'blue',
        pointBorderColor: 'blue',
        tension: 0.1
      }]
    },
    chartDataLabels () {
      return this.chartData.datasets.map(dataset => dataset.label)
    }
  },
  data: () => ({
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
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
