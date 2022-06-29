<template>
  <ShChip :color="enabled ? 'primary' : 'error'">
    {{ enabled ? 'Habilitado' : 'Deshabilitado' }}
  </ShChip>
</template>
<script>
export default {
  props: {
    enabled: {
      type: Boolean,
      required: true
    }
  }
}
</script>
