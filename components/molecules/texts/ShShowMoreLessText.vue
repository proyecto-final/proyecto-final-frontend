<template>
  <div v-if="!readMore">
    <ShBodySmall neutral>
      {{ cutTo(text, charactersToShow) }}
    </ShBodySmall>
    <ShIconButton
      v-if="text.length > charactersToShow"
      icon="mdi-plus"
      color="neutral"
      title="Mostrar más"
      small
      @click="showMoreLess"
    />
  </div>
  <div v-else>
    <ShBodySmall neutral>
      {{ text }}
    </ShBodySmall>
    <ShIconButton
      icon="mdi-minus"
      color="neutral"
      title="Mostrar menos"
      small
      @click="showMoreLess"
    />
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    charactersToShow: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    readMore: false
  }),
  methods: {
    cutTo (str, length) {
      return str.length > length ? `${str.substr(0, length - 3)}...` : str
    },
    showMoreLess () {
      this.readMore = !this.readMore
    }
  }
}
</script>
