<template>
  <div>
    <v-avatar
      v-for="(avatar, index) in showableAvatars"
      :key="index"
      :color="avatar.color"
      size="32"
      class="sh-avatar"
    >
      <ShSpecialLabelSmall class="white-text">
        {{ avatar.text }}
      </ShSpecialLabelSmall>
    </v-avatar>
  </div>
</template>
<script>
export default {
  props: {
    avatars: {
      type: Array,
      required: true
    },
    avatarsToShow: {
      type: Number,
      default: -1
    }
  },
  computed: {
    showableAvatars () {
      const elementsLeftAvatar = {
        text: '',
        color: 'avatar6'
      }
      if (this.avatars.length > this.avatarsToShow && this.avatarsToShow !== -1) {
        elementsLeftAvatar.text = `+${(this.avatars.length - this.avatarsToShow + 1)}`
        return [...this.avatars.slice(0, this.avatarsToShow - 1), elementsLeftAvatar]
      } else {
        return this.avatars
      }
    }
  }
}
</script>
<style scoped>
.sh-avatar:not(:first-child) {
  position: relative;
  margin-left: -7px;
}
</style>
