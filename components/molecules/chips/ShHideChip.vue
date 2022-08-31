<template>
  <div>
    <div v-if="anArray.length === 0">
      <slot name="defaultCase" />
    </div>
    <div v-if="anArray.length > maxElements2Show">
      <slot name="showableChips" v-bind="props">
        <ShChip
          v-for="(showableElement, indexShowableElement) in getShowableElements"
          :key="indexShowableElement"
          :color="chipColor"
          class="mr-1"
        >
          {{ showableElement }}
        </ShChip>
      </slot>
      <v-menu
        offset-x
        close-on-content-click
      >
        <template #activator="{ on, attrs }">
          <ShChip v-bind="attrs" :color="chipColor" v-on="on">
            {{ `+ ${anArray.length - maxElements2Show}` }}
          </ShChip>
        </template>
        <v-list :color="listColor" nav class="sh-scrollbar mh-200-px">
          <slot name="hiddenChips" v-bind="props">
            <v-list-item
              v-for="(hiddenElement, indexHiddenElement) in getHiddenElements"
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
    <div v-else>
      <slot name="allChips" v-bind="props">
        <ShChip
          v-for="(element, index) in anArray"
          :key="index"
          :color="chipColor"
          class="mr-1"
        >
          {{ element }}
        </ShChip>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    anArray: {
      type: Array,
      required: true
    },
    maxElements2Show: {
      type: Number,
      required: true
    },
    chipColor: {
      type: String,
      required: true
    },
    listColor: {
      type: String,
      required: true
    }
  },
  computed: {
    getHiddenElements () {
      return [...this.anArray].splice(this.maxElements2Show, this.anArray.length)
    },
    getShowableElements () {
      return [...this.anArray].splice(0, this.maxElements2Show)
    }
  }
}
</script>
