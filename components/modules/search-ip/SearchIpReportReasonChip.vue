<template>
  <v-tooltip bottom>
    <template #activator="{on, attrs}">
      <ShChip
        small
        color="note1"
        class="mr-2"
        v-bind="attrs"
        v-on="on"
      >
        {{ category }}
      </ShChip>
    </template>
    <template>
      {{ categoryTitle }}
    </template>
  </v-tooltip>
</template>
<script>
export default {
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    reasonTitles: [{ id: 1, title: 'DNS Compromise' }, { id: 2, title: 'DNS Poisoning' }, { id: 3, title: 'Fraud Orders' }, { id: 4, title: 'DDoS Attack' }, { id: 5, title: 'FTP Brute-Force' }, { id: 6, title: 'Ping of Death' }, { id: 7, title: 'Phishing' }, { id: 8, title: 'Fraud VoIP' }, { id: 9, title: 'Open Proxy' }, { id: 10, title: 'Web Spam' }, { id: 11, title: 'Email Spam' }, { id: 12, title: 'Blog Spam' }, { id: 13, title: 'VPN IP' }, { id: 14, title: 'Port Scan' }, { id: 15, title: 'Hacking' }, { id: 16, title: 'SQL Injection' }, { id: 17, title: 'Spoofing' }, { id: 18, title: 'Brute-Force' }, { id: 19, title: 'Bad Web Bot' }, { id: 20, title: 'Exploited Host' }, { id: 21, title: 'Web App Attack' }, { id: 22, title: 'SSH' }, { id: 23, title: 'IoT Targeted' }]
  }),
  computed: {
    categoryTitle () {
      const reason = this.reasonTitles.find(reason => reason.id === this.category)
      return reason?.title || ''
    }
  }
}
</script>
