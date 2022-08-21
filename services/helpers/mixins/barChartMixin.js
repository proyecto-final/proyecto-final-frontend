import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import systemColorsMixin from '@/services/helpers/mixins/systemColorsMixin'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  mixins: [systemColorsMixin],
  name: 'BarChart',
  components: { Bar },
  props: {
    colorOffset: {
      type: Number,
      default: 0
    },
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
        .every(dataset => 'label' in dataset && 'data' in dataset)
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
          backgroundColor: this.getColorForIndex(this.colorOffset + idx)
        }
      })
    }
  },
  data: () => ({
    chartOptions: {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      },
      layout: {
        padding: {
          left: 30,
          right: 30,
          bottom: 30,
          top: 30
        }
      }
    }
  })
}
