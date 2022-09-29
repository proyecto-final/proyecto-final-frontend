<template>
  <div class="ml-9">
    <v-row no-gutters>
      <v-col>
        <ShCode strong>
          Atributo
        </ShCode>
      </v-col>
      <v-col>
        <ShCode strong>
          Valor
        </ShCode>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <ShCode>
          Aplicación
        </ShCode>
      </v-col>
      <v-col>
        <v-tooltip top class="mr-2">
          <template #activator="{on}">
            <span v-on="on">
              <ShCode>
                {{ cutTo(line.detail.application, 28) || 'N/A' }}
              </ShCode>
            </span>
          </template>
          <template #default>
            {{ line.detail.application }}
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <ShCode>
          ID Aplicación
        </ShCode>
      </v-col>
      <v-col>
        <ShCode>
          {{ line.detail.applicationId || 'N/A' }}
        </ShCode>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <ShCode>
          Usuario
        </ShCode>
      </v-col>
      <v-col>
        <ShCode>
          {{ line.detail.computer || 'N/A' }}
        </ShCode>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <ShCode>
          Evento
        </ShCode>
      </v-col>
      <v-col>
        <ShCode>
          {{ line.detail.eventId || 'N/A' }}
        </ShCode>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <ShCode>
          Descripción de evento
        </ShCode>
      </v-col>
      <v-col>
        <v-tooltip top class="mr-2">
          <template #activator="{on}">
            <span v-on="on">
              <ShCode>
                <ShCode>
                  {{ cutTo(getEventById(line.detail.eventId).description || 'N/A', 20) }}
                </ShCode>
              </ShCode>
            </span>
          </template>
          <template #default>
            {{ getEventById(line.detail.eventId).description || 'N/A' }}
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <ShCode>
          IP Origen
        </ShCode>
      </v-col>
      <v-col>
        <ShCode>
          {{ line.detail.sourceIp || 'N/A' }}
        </ShCode>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <ShCode>
          IP Destino
        </ShCode>
      </v-col>
      <v-col>
        <ShCode>
          {{ line.detail.destinationIp || 'N/A' }}
        </ShCode>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import EventTranslation from '@/services/helpers/mixins/EventTranslation'
export default {
  mixins: [EventTranslation],
  props: {
    line: {
      type: Object,
      required: true
    }
  },
  methods: {
    cutTo (str, length) {
      return str?.length > length ? `${str.substr(0, length - 3)}...` : str
    }
  }
}
</script>
