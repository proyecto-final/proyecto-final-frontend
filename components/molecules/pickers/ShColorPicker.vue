<template>
  <div>
    <v-icon
      v-for="color in colors"
      :key="color"
      class="mx-2"
      large
      :color="color"
      @click="selected = color"
    >
      {{ color === selected ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle' }}
    </v-icon>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    colors: ['#E27B9E', '#EE83DB', '#CA72E7', '#AC7FF7', '#7574EB',
      '#6381F7', '#6492E6', '#69ACCF', '#75CED1', '#66B494', '#77C07B', '#EBDE4E', '#F1CB59', '#EEAD52', '#ED9468']
  }),
  computed: {
    selected: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
