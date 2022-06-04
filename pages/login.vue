<template>
  <v-row justify="center" class="h-100">
    <v-col cols="12" sm="8" md="6" class="d-flex align-center">
      <v-card elevation="0" class="w-100">
        <v-card-text class="pa-8">
          <div class="mb-4">
            <ShContentHeader>
              Inicio de sesión
            </ShContentHeader>
          </div>
          <div class="d-flex justify-center mb-8">
            <div>
              <v-img
                src="logo.svg"
                width="200"
              />
            </div>
          </div>
          <div class="mb-4">
            <ShContentTitle>
              Para acceder, ingresá tus datos
            </ShContentTitle>
          </div>
          <div>
            <ShTextField label="Usuario o e-mail" />
            <ShPasswordField label="Contraseña" />
          </div>
          <div class="mb-8">
            <NuxtLink class="text-decoration-none" to="/forgot-password">
              <ShSpecialLabel>
                ¿Olvidaste tu contraseña?
              </ShSpecialLabel>
            </NuxtLink>
          </div>
          <ShButton block large>
            Iniciar sesión
          </ShButton>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'login'
}
</script>
