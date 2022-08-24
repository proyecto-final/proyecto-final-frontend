<template>
  <div v-if="!readMore">
    <ShBodySmall neutral>
      {{ cutTo(text, charactersToShow) }}
    </ShBodySmall>
    <ShIconButton
      icon="mdi-plus"
      color="neutral"
      title="Mostrar más"
      small
      @click="showMore"
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
      @click="showLess"
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
    showMore () {
      this.readMore = true
    },
    showLess () {
      this.readMore = false
    }
  }
}
</script>
