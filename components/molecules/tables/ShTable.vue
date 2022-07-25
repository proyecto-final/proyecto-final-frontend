<template>
  <v-data-table
    class="sh-table"
    v-bind="$attrs"
    :footer-props="{
      itemsPerPageText: 'Filas por página',
      itemsPerPageAllText: 'Todos',
      itemsPerPageOptions: [10, 25, 50],
      pageText: `${currentElementOfPagePosition}-${lastElementOfPagePosition} de ${lastElement}`
    }"
    :headers="headersWithoutSortable"
    :options.sync="editableOptions"
    no-data-text="No hay resultados para la búsqueda"
    :server-items-length="serverItemsLength"
    v-on="$listeners"
  >
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
    <template v-for="(header) in headers" #[`header.${header.value}`]="headerData">
      <slot :name="`header.${header.value}`" v-bind="headerData">
        <ShHeading5 neutral>
          {{ header.text }}
        </ShHeading5>
      </slot>
    </template>
    <template v-for="(header) in headers" #[`item.${header.value}`]="itemData">
      <slot :name="`item.${header.value}`" v-bind="itemData">
        <ShBodySmall neutral>
          {{ itemData.item[header.value] }}
        </ShBodySmall>
      </slot>
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    serverItemsLength: {
      type: Number,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  computed: {
    editableOptions: {
      get () {
        return this.options
      },
      set (value) {
        this.$emit('update:options', value)
      }
    },
    headersWithoutSortable () {
      return this.headers.map(header => ({
        ...header,
        sortable: !!header.sortable
      }))
    },
    currentElementOfPagePosition () {
      return (this.options.page - 1) * this.options.itemsPerPage + 1
    },
    lastElementOfPagePosition () {
      return Math.min(this.options.page * this.options.itemsPerPage, this.lastElement)
    },
    lastElement () {
      return this.serverItemsLength
    }
  }
}
</script>
<style scoped>
.sh-table ::v-deep td {
    border-bottom: none !important;
    padding-top: 16px !important;
    padding-bottom: 16px !important;
}
</style>
