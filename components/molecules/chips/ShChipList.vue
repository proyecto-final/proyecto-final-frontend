<template>
  <div>
    <div v-if="items.length === 0">
      <slot name="default" />
    </div>
    <div>
      <slot name="showableChips" v-bind="props">
        <ShChip
          v-for="(showableElement, indexShowableElement) in showableElements"
          :key="indexShowableElement"
          :color="chipColor"
          class="mr-1"
        >
          {{ showableElement }}
        </ShChip>
      </slot>
      <v-menu
        v-if="items.length > maxElements2Show"
        offset-x
        close-on-content-click
      >
        <template #activator="{ on, attrs }">
          <ShChip v-bind="attrs" :color="chipColor" v-on="on">
            {{ `+ ${items.length - maxElements2Show}` }}
          </ShChip>
        </template>
        <v-list :color="listColor" nav class="sh-scrollbar mh-200-px">
          <slot name="hiddenChips" v-bind="props">
            <v-list-item
              v-for="(hiddenElement, indexHiddenElement) in hiddenElements"
              :key="indexHiddenElement"
            >
              <ShChip :color="chipColor">
                {{ hiddenElement }}
              </ShChip>
            </v-list-item>
          </slot>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    maxElements2Show: {
      type: Number,
      default: 2
    },
    chipColor: {
      type: String,
      default: 'note1'
    },
    listColor: {
      type: String,
      default: 'note1'
    }
  },
  computed: {
    hiddenElements () {
      return this.items.slice(this.maxElements2Show, this.items.length + 1)
    },
    showableElements () {
      return this.items.slice(0, this.maxElements2Show)
    }
  }
}
</script>
