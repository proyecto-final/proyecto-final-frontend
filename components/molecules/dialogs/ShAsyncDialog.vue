<template>
  <v-dialog
    v-model="show"
    v-bind="$attrs"
    permanent
    v-on="$listeners"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props" />
    </template>
    <template #default="props">
      <v-card class="pa-6">
        <slot name="progressBar" v-bind="props">
          <v-progress-linear v-if="loadingFunction" indeterminate color="primary" />
        </slot>
        <div class="d-flex justify-space-between align-center">
          <ShHeading3 v-if="!hideTitle" neutral>
            {{ title }}
          </ShHeading3>
          <ShIconButton v-if="!hideCloseButton" color="neutral" icon="mdi-close" title="Cerrar" @click="close" />
        </div>
        <v-form
          ref="form"
          v-model="isValid"
          @submit.prevent="confirm(true)"
        >
          <ShBody>
            {{ text }}
          </ShBody>
          <slot />
        </v-form>
        <div>
          <div class="d-flex justify-end">
            <div>
              <slot name="secondary-button">
                <ShSecondaryButton
                  v-if="!hideSecondaryButton"
                  :loading="loadingFunction"
                  @click="close"
                >
                  {{ cancelText }}
                </ShSecondaryButton>
              </slot>
              <ShButton
                v-if="!hidePrimaryButton"
                class="ml-2"
                :loading="loadingFunction"
                :disabled="!canConfirm"
                @click="confirm(false)"
              >
                {{ confirmText }}
              </ShButton>
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
    canConfirm: {
      type: Boolean,
      default: true
    },
    asyncConfirmFunction: {
      type: Function,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Guardar'
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
    hideCloseButton: {
      type: Boolean,
      default: false
    },
    hideTitle: {
      type: Boolean,
      default: false
    },
    submitOnEnter: {
      type: Boolean,
      default: true
    },
    isNote: {
      type: Boolean,
      default: false
    },
    skipValidation: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    show: false,
    isValid: true,
    loadingFunction: false
  }),
  watch: {
    show (value) {
      if (value) {
        this.$emit('open')
      } else {
        this.$emit('close')
      }
      this.resetValidation()
    }
  },
  methods: {
    resetValidation () {
      this.$refs.form?.resetValidation()
    },
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },
    confirm (isEnter) {
      if (isEnter && !this.submitOnEnter) {
        return
      }
      if (!this.skipValidation) {
        this.$refs.form.validate()
        if (!this.isValid) {
          return
        }
      }
      this.loadingFunction = true
      this.asyncConfirmFunction().then((result) => {
        if (result) {
          this.show = false
          this.$emit('onConfirm', result)
          if (this.successText) {
            this.$noty.success(this.successText)
          }
        } else if (this.errorText) {
          this.$noty.error(this.errorText)
        }
      }).finally(() => { this.loadingFunction = false })
    }
  }
}
</script>
