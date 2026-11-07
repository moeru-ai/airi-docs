<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  /** Also the anchor and the message key under `docs.brand.sections`. */
  id: string
  index: number
}>()

const { t } = useI18n()

const number = computed(() => String(props.index).padStart(2, '0'))
</script>

<template>
  <section :id="id" class="bk-section" :aria-labelledby="`${id}-title`">
    <header class="bk-section__header">
      <div class="bk-section__index bk-mono bk-reveal">
        <span class="text-[color:var(--bk-pink-ink)]">{{ number }}</span>
        <span class="bk-section__rule" aria-hidden="true" />
      </div>
      <h2 :id="`${id}-title`" class="bk-section__title bk-display bk-reveal">
        <a :href="`#${id}`" class="bk-section__anchor">{{ t(`docs.brand.sections.${id}.title`) }}</a>
      </h2>
      <div v-if="$slots.actions" class="bk-section__actions bk-reveal">
        <slot name="actions" />
      </div>
    </header>

    <!-- The content has no shared animation. A section can be taller than the screen, so each element enters on its own, see `reveal.ts`. -->
    <slot />
  </section>
</template>

<style scoped>
.bk-section {
  scroll-margin-top: 5.5rem;
  padding-top: clamp(3.5rem, 9vw, 8rem);
}

.bk-section__header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem 2rem;
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
}

@media (min-width: 1024px) {
  .bk-section__header {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: auto auto;
    align-items: end;
  }

  .bk-section__index {
    grid-column: 1 / -1;
  }
}

.bk-section__index {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.bk-section__rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--bk-line-strong) 60%, transparent);
}

.bk-section__title {
  margin: 0;
  font-size: clamp(2.75rem, 7vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.045em;
  font-weight: 600;
  text-wrap: balance;
}

.bk-section__anchor {
  color: inherit;
  text-decoration: none;
}
</style>
