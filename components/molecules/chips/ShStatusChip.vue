<template>
  <div>
    <ShChip
      :color="status === 'processed' ? 'success' : (status === 'processing' ? 'warning' : 'error')"
    >
      {{ status === 'processed' ? 'Cargado' : (status === 'processing' ? 'Procesando...' : 'Error' ) }}
    </ShChip>
    <v-progress-linear
      v-model="value"
      rounded
      class="mt-2"
      color="primary"
      :active="show"
      :indeterminate="query"
      :query="true"
    />
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      value: 0,
      query: false,
      show: true,
      interval: 0
    }
  },
  mounted () {
    this.queryAndIndeterminate()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    queryAndIndeterminate () {
      this.query = true
      this.show = true
      this.value = 0
      setTimeout(() => {
        this.query = false
        this.interval = setInterval(() => {
          if (this.value === 100) {
            clearInterval(this.interval)
            this.show = false
            return setTimeout(this.queryAndIndeterminate, 2000)
          }
          this.value += 25
        }, 1000)
      }, 2500)
    }
  }
}
</script>
