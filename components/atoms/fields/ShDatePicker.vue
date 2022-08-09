<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="!range"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on }">
      <ShOutlinedTextField
        :value="formattedValue"
        :label="label"
        :placeholder="placeholder"
        :rules="rules"
        :hide-details="hideDetails"
        prepend-inner-icon="mdi-calendar"
        readonly
        @input="change"
        @click:clear="clear"
        v-on="on"
      />
    </template>
    <slot name="prepend-item" />
    <v-date-picker
      v-model="date"
      color="primary"
      :range="range"
      no-title
      scrollable
      :min="minDate"
      :max="maxDate"
      @input="change"
      @change="change"
    >
      <template v-if="range">
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="closeMenuAndClear"
        >
          Clear
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.menu.save(date)"
        >
          OK
        </v-btn>
      </template>
    </v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: {
    value: {
      type: [Date, String, Array],
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    maxDate: {
      type: String,
      default: ''
    },
    minDate: {
      type: String,
      default: null
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    menu: false
  }),
  computed: {
    date: {
      get () {
        return this.value
      },
      set (val) {
        if (this.range) {
          if (val?.length === 2) {
            const values = [...val]
            values.sort()
            this.$emit('input', values)
          } else {
            this.$emit('input', [])
          }
        } else {
          this.$emit('input', val)
        }
      }
    },
    formattedValue () {
      const formatDate = date => date
        ? new Date(date.replace(/-/g, '/'))
          .toLocaleDateString()
        : date
      if (Array.isArray(this.date)) {
        const from = this.date[0] <= this.date[1] ? this.date[0] : this.date[1]
        const to = this.date[0] > this.date[1] ? this.date[0] : this.date[1]
        return from && to ? `${formatDate(from)} | ${formatDate(to)}` : ''
      }
      return formatDate(this.date)
    }
  },
  methods: {
    clear () {
      this.$emit('input', this.range ? [] : '')
    },
    change (val) {
      const dateIfCleared = this.range ? [] : ''
      this.$emit('input', val || dateIfCleared)
    },
    closeMenuAndClear () {
      this.menu = false
      this.clear()
    }
  }
}
</script>
<style scoped>
::v-deep .v-input__icon{
  margin-top: 4px !important
}
</style>
