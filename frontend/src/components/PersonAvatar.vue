<template>
  <v-avatar :size="size" class="avatar" :style="tone" aria-hidden="true">
    <span class="avatar-initials" :style="{ fontSize: size * 0.38 + 'px' }">{{ initials }}</span>
  </v-avatar>
</template>

<script>
// Quiet tints an avatar can take; the same key always gets the same one
const TONES = [
  { background: '#e3e9f5', color: '#1f3f8f' },
  { background: '#e9ebef', color: '#3a4150' },
  { background: '#f3eadb', color: '#6b4700' }
];

export default {
  name: 'PersonAvatar',
  props: {
    name: { type: String, default: '' },
    // What decides the colour: the person's family (see familyKeys.js), else their surname
    colorKey: { type: [String, Number], default: null },
    size: { type: Number, default: 48 }
  },
  computed: {
    initials() {
      return this.name
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word[0].toUpperCase())
        .slice(0, 2)
        .join('');
    },
    tone() {
      const key = String(this.colorKey == null ? this.name : this.colorKey).toLowerCase();
      let hash = 0;
      for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
      return TONES[hash % TONES.length];
    }
  }
};
</script>

<style scoped>
.avatar {
  flex: none;
}
.avatar-initials {
  font-weight: 700;
  line-height: 1;
}
</style>
