<template>
  <header class="page-band">
    <div class="page-band-inner">
      <div class="page-band-text">
        <h1>{{ title }}</h1>
        <p v-if="lede" class="page-band-lede">{{ lede }}</p>
      </div>
      <div v-if="$slots.default" class="page-band-actions">
        <slot />
      </div>
    </div>
  </header>
</template>

<script>
// The tinted header band that opens every page
export default {
  name: 'PageBand',
  props: {
    title: { type: String, required: true },
    lede: { type: String, default: '' }
  }
};
</script>

<style scoped>
.page-band-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 28px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  flex-wrap: wrap;
}
.page-band {
  background: #f1f4f9;
  border-bottom: 3px solid rgb(var(--v-theme-gold));
}
.page-band-lede {
  margin: 8px 0 0;
  color: var(--ink-muted);
  font-size: 1.125rem;
  max-width: 60ch;
}
.page-band-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 599px) {
  .page-band-inner {
    padding: 24px 16px 20px;
  }
}
</style>
