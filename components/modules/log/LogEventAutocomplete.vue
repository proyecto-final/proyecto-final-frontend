<template>
  <ShAutocomplete
    v-bind="$attrs"
    hide-details
    clearable
    multiple
    show-scroll
    cache-items
    item-value="code"
    item-text="description"
    :items="differentEventsWithDescription"
    placeholder="Filtrar por evento"
    :value="value"
    v-on="$listeners"
  >
    <template #selection="{item, index}">
      <span>
        {{ index > 3 ? (index === 4 ? '...' : '') : item.code }}<template v-if="index < 3 && value.length > index + 1">,</template>
      </span>
    </template>
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </ShAutocomplete>
</template>
<script>
import EventTranslation from '@/services/helpers/mixins/EventTranslation'
export default {
  mixins: [EventTranslation],
  props: {
    value: {
      type: Array,
      required: true
    },
    log: {
      type: Object,
      required: true
    }
  },
  computed: {
    differentEventsWithDescription () {
      return this.allEventsWithDescription
        .filter(event => this.log?.differentEvents?.includes(event.code))
        .map(event => ({ code: event.code, description: `${event.code} - ${event.description}` }))
    }
  }
}
</script>
