<template>
  <v-dialog
    v-bind="$attrs"
    permanent
    :fullscreen="fullscreen"
    v-on="$listeners"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props" />
    </template>
    <template #default>
      <v-progress-linear v-if="loading" indeterminate color="primary" />
      <v-card
        class="pa-6"
        :class="{'no-rounded': fullscreen, [cardClass]: true}"
      >
        <div class="d-flex justify-space-between align-center">
          <slot name="prepend-title" :close="close" />
          <ShHeading3 neutral class="pl-4">
            {{ title }}
          </ShHeading3>
          <slot name="close">
            <ShIconButton color="neutral" icon="mdi-close" title="Cerrar" @click="close()" />
          </slot>
        </div>
        <div>
          <slot />
        </div>
        <div>
          <div class="d-flex justify-end">
            <div>
              <slot name="secondary-button">
                <ShSecondaryButton
                  v-if="!hideSecondaryButton"
                  @click="$emit('input', false)"
                >
                  {{ cancelText }}
                </ShSecondaryButton>
              </slot>
            </div>
          </div>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    },
    successText: {
      type: String,
      default: ''
    },
    errorText: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideSecondaryButton: {
      type: Boolean,
      default: false
    },
    hidePrimaryButton: {
      type: Boolean,
      default: false
    },
    cardClass: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    }
  }
}
</script>
<style scoped>
.no-rounded {
  border-radius: 0 !important;
}
</style>
