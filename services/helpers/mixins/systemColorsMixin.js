export default {
  data: () => ({
    colors: ['#E27B9E', '#EE83DB', '#CA72E7', '#AC7FF7', '#7574EB',
      '#6381F7', '#6492E6', '#69ACCF', '#75CED1', '#66B494', '#77C07B', '#EBDE4E', '#F1CB59', '#EEAD52', '#ED9468']
  }),
  methods: {
    getColorForIndex (index) {
      return this.colors[index % this.colors.length]
    }
  }
}
