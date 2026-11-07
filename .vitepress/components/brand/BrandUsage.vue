<script setup lang="ts">
import type { BrandAsset, BrandTone } from './assets'

import { useI18n } from 'vue-i18n'

import { usePageDark } from './feedback'

/**
 * Correct use and misuse of the logo, in two groups. Each correct example shows the file for its background.
 */
const props = defineProps<{
  /** The logo for light backgrounds. */
  light: BrandAsset
  /** The logo for dark backgrounds. */
  dark: BrandAsset
}>()

const { t } = useI18n()
const pageDark = usePageDark()

/** `id` is also the message key under `docs.brand.usage.examples`. */
const dos: { id: string, tone: BrandTone }[] = [
  { id: 'on-light', tone: 'light' },
  { id: 'on-dark', tone: 'dark' },
]

/** Message keys under `docs.brand.usage.examples`, also the modifier classes of the logo. These examples follow the page theme. */
const donts = ['stretch', 'rotate', 'recolor', 'effects', 'busy', 'opacity']

function assetOf(tone: BrandTone): BrandAsset {
  return tone === 'dark' ? props.dark : props.light
}
</script>

<template>
  <div class="bk-usage">
    <div class="bk-usage__groups">
      <section class="is-dos">
        <h4 class="bk-usage__title bk-reveal is-with-icons">
          <span class="bk-usage__badge is-do" aria-hidden="true"><span class="i-lucide:check" /></span>
          {{ t('docs.brand.usage.dos') }}
        </h4>
        <ul class="bk-usage__grid">
          <li v-for="example of dos" :key="example.id" class="bk-usage__example bk-reveal is-with-icons">
            <div class="bk-usage__stage" :class="`is-${example.tone}`">
              <img :src="assetOf(example.tone).files[0].src" alt="" draggable="false">
            </div>
            <p>{{ t(`docs.brand.usage.examples.${example.id}`) }}</p>
          </li>
        </ul>
      </section>

      <section class="is-donts">
        <h4 class="bk-usage__title bk-reveal is-with-icons">
          <span class="bk-usage__badge is-dont" aria-hidden="true"><span class="i-lucide:x" /></span>
          {{ t('docs.brand.usage.donts') }}
        </h4>
        <ul class="bk-usage__grid">
          <li v-for="id of donts" :key="id" class="bk-usage__example bk-reveal is-with-icons">
            <div class="bk-usage__stage" :class="{ 'is-busy': id === 'busy' }">
              <img :src="assetOf(pageDark ? 'dark' : 'light').files[0].src" alt="" draggable="false" :class="`is-${id}`">
              <span class="bk-usage__strike" aria-hidden="true" />
            </div>
            <p>{{ t(`docs.brand.usage.examples.${id}`) }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* The layout follows the width of the content, which is narrower when the page has a section index. */
.bk-usage {
  container-type: inline-size;
  margin-top: clamp(2rem, 4vw, 3rem);
}

.bk-usage__groups {
  display: grid;
  gap: 1.5rem;
}

.bk-usage__title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.5rem;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
}

.bk-usage__badge {
  display: grid;
  flex: none;
  place-items: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 999px;
  color: #fff;
  font-size: 0.6875rem;
}

.bk-usage__badge.is-do { background: #3aa76d; }
.bk-usage__badge.is-dont { background: #e5484d; }

.bk-usage__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* The cells of a row touch. Each cell has no left border, except the first cell, so two neighbors share one line. */
.bk-usage__example:nth-child(2n + 1) {
  --stage-left: 1px;
}

/* Two rows: one column of correct examples and three columns of misuse, so the two groups form a full rectangle. */
@container (min-width: 640px) {
  .bk-usage__groups {
    grid-template-columns: 1fr 3fr;
  }

  .is-dos .bk-usage__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .is-dos .bk-usage__example:nth-child(n) {
    --stage-left: 1px;
  }

  .is-donts .bk-usage__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .is-donts .bk-usage__example:nth-child(n) {
    --stage-left: 0;
  }

  .is-donts .bk-usage__example:nth-child(3n + 1) {
    --stage-left: 1px;
  }
}

/* One row, so the rules stay smaller than the logo above them. */
@container (min-width: 1040px) {
  .bk-usage__groups {
    grid-template-columns: 2fr 6fr;
  }

  .is-dos .bk-usage__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .is-dos .bk-usage__example:nth-child(n) {
    --stage-left: 0;
  }

  .is-dos .bk-usage__example:nth-child(2n + 1) {
    --stage-left: 1px;
  }

  .is-donts .bk-usage__grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .is-donts .bk-usage__example:nth-child(n) {
    --stage-left: 0;
  }

  .is-donts .bk-usage__example:nth-child(6n + 1) {
    --stage-left: 1px;
  }
}

.bk-usage__example p {
  margin: 0.75rem 0 0;
  padding-right: 1rem;
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  line-height: 1.5;
}

.bk-usage__stage {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  overflow: hidden;
  background-color: hsl(var(--foreground) / 0.03);
  border: 1px solid var(--bk-line);
  border-left-width: var(--stage-left, 0);
}

.is-donts .bk-usage__stage {
  cursor: not-allowed;
}

/* The correct examples use the same surfaces as the logo tiles. */
.bk-usage__stage.is-light { background-color: #faf9fb; }
.bk-usage__stage.is-dark { background-color: #0e0f11; }

/* A dense texture of thin lines and dots in the color of the text. It breaks up the outline of the logo, and it has no colors of its own. */
.bk-usage__stage.is-busy {
  background-image:
    radial-gradient(circle, hsl(var(--foreground) / 0.32) 0 1.25px, transparent 1.75px),
    repeating-linear-gradient(45deg, hsl(var(--foreground) / 0.16) 0 1px, transparent 1px 6px),
    repeating-linear-gradient(-45deg, hsl(var(--foreground) / 0.16) 0 1px, transparent 1px 6px);
  background-size: 12px 12px, auto, auto;
}

.bk-usage__stage img {
  width: 46%;
  aspect-ratio: 1;
  transition: transform 0.6s var(--bk-ease-out);
}

.bk-usage__stage img.is-stretch { transform: scale(1.5, 0.78); }
.bk-usage__stage img.is-rotate { transform: rotate(-22deg); }
.bk-usage__stage img.is-recolor { filter: hue-rotate(150deg) saturate(1.8); }
.bk-usage__stage img.is-effects { filter: drop-shadow(0 12px 6px rgb(0 0 0 / 0.45)) drop-shadow(0 0 18px #55c8ff); }
.bk-usage__stage img.is-opacity { opacity: 0.3; }

/*
 * A narrow container, such as a phone: three columns of misuse, so they take two rows. The correct examples keep two columns, and
 * the shape 3:2 gives their cells the height of the misuse cells. Their logo has the same size as the logo in the misuse cells.
 */
@container (max-width: 639px) {
  .is-donts .bk-usage__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .is-donts .bk-usage__example:nth-child(n) {
    --stage-left: 0;
  }

  .is-donts .bk-usage__example:nth-child(3n + 1) {
    --stage-left: 1px;
  }

  .is-dos .bk-usage__stage {
    aspect-ratio: 3 / 2;
  }

  .is-dos .bk-usage__stage img {
    width: calc(46% * 2 / 3);
  }

  .bk-usage__example p {
    margin-top: 0.5rem;
    padding-right: 0.5rem;
    font-size: 0.8125rem;
  }
}

/* Small cells of one row: a smaller logo and smaller text. */
@container (min-width: 1040px) {
  .bk-usage__stage img {
    width: 42%;
  }

  .bk-usage__example p {
    padding-right: 0.5rem;
    font-size: 0.8125rem;
  }
}

/* A diagonal red line through the example, as on a "no" sign. */
.bk-usage__strike {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top right, transparent calc(50% - 1px), rgb(229 72 77 / 0.75) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px));
  opacity: 0.85;
}
</style>
