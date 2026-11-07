<script setup lang="ts">
import type { BrandAsset } from './assets'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import BrandArchiveButton from './BrandArchiveButton.vue'
import BrandShowcase from './BrandShowcase.vue'

import { kitAssets } from './assets'

const props = defineProps<{
  assets: BrandAsset[]
}>()

const kit = computed(() => kitAssets(props.assets))
const desktop = computed(() => props.assets.find(asset => asset.id === 'screenshot-desktop')!)

const { t, locale } = useI18n()

/**
 * Words of the title, each one split into characters that rise into place with a small delay.
 *
 * A line can break between words but not inside a word. `Intl.Segmenter` finds the
 * words, also in Japanese text without spaces, and keeps grapheme clusters, such as
 * Korean syllables, whole.
 *
 * Before:
 * - `'Brand Kit'`
 *
 * After:
 * - `[{ chars: [{ char: 'P', index: 0 }, …] }, { chars: [{ char: ' ', index: 5 }] }, { chars: [{ char: 'K', index: 6 }, …] }]`
 */
const titleWords = computed(() => {
  const title = t('docs.brand.hero.title')
  const wordSegmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(locale.value, { granularity: 'word' }) : undefined
  const graphemeSegmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(locale.value, { granularity: 'grapheme' }) : undefined

  const words = wordSegmenter ? Array.from(wordSegmenter.segment(title), part => part.segment) : title.split(/(\s+)/)
  let index = 0

  return words.map(word => ({
    space: /^\s+$/.test(word),
    chars: (graphemeSegmenter ? Array.from(graphemeSegmenter.segment(word), part => part.segment) : Array.from(word))
      .map(char => ({ char, index: index++ })),
  }))
})
</script>

<template>
  <section class="bk-hero">
    <div class="bk-hero__copy">
      <h1 class="bk-hero__title bk-display" :aria-label="t('docs.brand.hero.title')">
        <template v-for="(word, wordIndex) of titleWords" :key="wordIndex">
          <span v-if="word.space" aria-hidden="true">{{ ' ' }}</span>
          <span v-else class="bk-hero__word" aria-hidden="true">
            <span
              v-for="item of word.chars"
              :key="item.index"
              class="bk-hero__char"
              :style="{ '--i': item.index }"
            >{{ item.char }}</span>
          </span>
        </template>
      </h1>

      <p class="bk-hero__lead">
        {{ t('docs.brand.hero.lead') }}
      </p>

      <div class="bk-hero__actions">
        <BrandArchiveButton
          :assets="kit"
          name="airi-brand-kit"
          :label="t('docs.brand.download.kit')"
          variant="primary"
          size="lg"
        />
        <BrandArchiveButton
          :assets="assets"
          name="airi-all-assets"
          :label="t('docs.brand.download.all')"
          size="lg"
        />
      </div>
    </div>

    <div class="bk-hero__visual">
      <BrandShowcase :screenshot="desktop" :caption="t('docs.brand.hero.caption')" />
    </div>
  </section>
</template>

<style scoped>
.bk-hero {
  display: grid;
  gap: clamp(3rem, 6vw, 5rem);
  padding-block: clamp(3rem, 8vw, 7rem) clamp(4rem, 8vw, 7rem);
}

@media (min-width: 1024px) {
  .bk-hero {
    grid-template-columns: minmax(0, 6fr) minmax(0, 6fr);
    align-items: center;
  }
}

.bk-hero__title {
  margin: 0;
  font-size: clamp(3.75rem, 9vw, 8.75rem);
  font-weight: 600;
  line-height: 0.9;
  letter-spacing: -0.055em;
  /* Room for the descenders, the characters are clipped while they rise. */
  padding-bottom: 0.08em;
}

.bk-hero__word {
  display: inline-block;
  white-space: nowrap;
}

/*
 * The entrance animations have only a start state and fill backwards. Their end state is the normal style of the element,
 * so no animation applies after the end, and the browser removes their compositor layers. With a forward fill, the layers
 * stay for as long as the page is open, and the content after them needs more layers.
 */
.bk-hero__char {
  display: inline-block;
  animation: bk-char-in 1.1s var(--bk-ease-out) backwards;
  animation-delay: calc(var(--i) * 45ms + 120ms);
}

@keyframes bk-char-in {
  from {
    opacity: 0;
    transform: translateY(0.45em) rotate(4deg);
    filter: blur(8px);
  }
}

.bk-hero__lead {
  max-width: 36rem;
  margin: clamp(1.5rem, 3vw, 2.25rem) 0 0;
  color: hsl(var(--muted-foreground));
  font-size: clamp(1.0625rem, 1.4vw, 1.25rem);
  line-height: 1.55;
  text-wrap: pretty;
  animation: bk-rise 0.9s var(--bk-ease-out) 0.45s backwards;
}

.bk-hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.75rem;
  margin-top: clamp(2rem, 4vw, 3rem);
  animation: bk-rise 0.9s var(--bk-ease-out) 0.6s backwards;
}

/* The screenshot runs its own entrance animation. */
@media (min-width: 1024px) {
  .bk-hero__visual {
    width: 100%;
    max-width: 44rem;
    justify-self: end;
  }
}

@keyframes bk-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bk-hero__char,
  .bk-hero__lead,
  .bk-hero__actions {
    animation-duration: 1ms;
    animation-delay: 0ms;
  }
}
</style>
