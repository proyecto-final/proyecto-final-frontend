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
import systemColorsMixin from '@/services/helpers/mixins/systemColorsMixin'
export default {
  mixins: [systemColorsMixin],
  props: {
    value: {
      type: String,
      required: true
    }
  },
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
