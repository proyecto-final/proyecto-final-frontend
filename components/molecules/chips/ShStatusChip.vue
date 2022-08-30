<template>
  <ShChip
    :color="status === 'processed' ? 'success' : (status === 'processing' ? 'warning' : 'error')"
  >
    {{ status === 'processed' ? 'Cargado' : (status === 'processing' ? 'Procesando...' : 'Error' ) }}
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
