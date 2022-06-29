<template>
  <v-tooltip :disabled="disableTooltip" v-bind="tooltipAttrs">
    <template #activator="{ on, attrs }">
      <span v-on="on">
        <v-btn
          v-bind="{...$attrs,...attrs}"
          :class="{[buttonClass]: true}"
          :color="color"
          icon
          :small="small"
          v-on="$listeners"
        >
          <v-icon :small="small" :color="color">
            {{ icon }}
          </v-icon>
        </v-btn>
      </span>
    </template>
    <span>{{ title }}</span>
  </v-tooltip>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    disableTooltip: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    buttonClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    tooltipAttrs () {
      const found = ['top', 'bottom', 'left', 'right'].find(position => position in this.$attrs) || 'bottom'
      return { [found]: true }
    }
  }
}
</script>
