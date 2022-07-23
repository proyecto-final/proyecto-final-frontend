<template>
  <ShChip :color="status === 'loaded' ? 'success' : 'warning'">
    {{ status === 'loaded' ? 'Cargado' : 'Procesando...' }}
  </ShChip>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  }
}
</script>
