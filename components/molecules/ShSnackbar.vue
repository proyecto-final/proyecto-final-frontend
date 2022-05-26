<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
    top
    :color="color"
    content-class="pa-0"
    min-width="300px"
    class="sh-snackbar"
  >
    <v-alert
      v-model="snackbar"
      :type="color"
      class="ma-0"
      :class="{clickable: snackbarAction}"
      :icon="icon"
      data-cy="snackbar-notification"
      @click="executeSnackbarAction"
    >
      <div class="d-flex justify-space-between">
        <div>
          <div v-if="title">
            <EmBody2 bold>
              {{ title }}
            </EmBody2>
          </div>
          <div>
            <EmBody3>
              {{ text }}
            </EmBody3>
          </div>
        </div>
        <div class="align-content-center d-flex">
          <v-icon color="white" @click.stop="close">
            mdi-close
          </v-icon>
        </div>
      </div>
    </v-alert>
  </v-snackbar>
</template>
<script>
export default {
  data: () => ({
    snackbar: false,
    text: '',
    title: '',
    type: 'success',
    timeout: -1,
    snackbarAction: null
  }),
  computed: {
    icon () {
      return this.type === 'message' ? 'mdi-chat' : null
    },
    color () {
      return this.type === 'message' ? 'info' : this.type
    }
  },
  watch: {
    snackbar (val) {
      if (!val) {
        this.$destroy()
        this.$el.parentNode?.removeChild(this.$el)
      }
    }
  },
  methods: {
    show ({ title, text, timeout, type, snackbarAction }) {
      this.title = title
      this.text = text
      this.type = type
      this.timeout = timeout || this.timeout
      this.snackbar = true
      this.snackbarAction = snackbarAction
    },
    close () {
      this.snackbar = false
    },
    executeSnackbarAction () {
      if (this.snackbarAction) {
        this.snackbarAction()
        this.close()
      }
    }
  }
}
</script>
<style scoped>
.sh-snackbar >>> .v-snack__action{
  margin-right: 0px;
}
.sh-snackbar >>> .v-snack__wrapper{
  border-radius: 8px;
  display: flex;
}
.sh-snackbar >>> .v-alert__icon{
  margin-top: 4px;
  align-self: center;
}
.clickable{
  cursor: pointer;
}
</style>
