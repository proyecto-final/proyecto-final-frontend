<template>
  <v-card>
    <div class="mt-4 ml-4">
      <ShHeading2>
        {{ title }}
      </ShHeading2>
      <ShBodySmall neutral>
        {{ description }}
      </ShBodySmall>
    </div>
    <ShDoughnutChart
      class="ma-6"
      :chart-data="chartData"
    />
  </v-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    chartData: {
      type: Object,
      required: true
    }
  }
}
</script>
