<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BrandColorSwatch from './BrandColorSwatch.vue'

import { MARK_PINK } from './assets'
import { copyText, useBrandToast } from './feedback'
import { CREDIT_HOLDERS, CREDIT_LINE } from './kit'

const { t } = useI18n()
const toast = useBrandToast()

const fonts = [
  { role: 'display', name: 'Comfortaa', family: 'var(--bk-font-display)', url: 'https://fonts.google.com/specimen/Comfortaa' },
  { role: 'text', name: 'Nunito', family: 'var(--bk-font-text)', url: 'https://fonts.google.com/specimen/Nunito' },
] as const

/** The written forms of the name. The sources are the README of the AIRI repository and the `productName` of its desktop build. */
const names: { role: string, value: string }[] = [
  { role: 'full', value: 'Project AIRI' },
  { role: 'short', value: 'AIRI' },
]

/**
 * "Airi" is the former spelling, see the post "DreamLog 0x1". The AIRI repository uses the lowercase form only in addresses,
 * commands, and package names.
 */
const wrongNames = ['Airi', 'airi']

async function copy(value: string) {
  const copied = await copyText(value)
  toast.show(copied ? t('docs.brand.actions.copied', { value }) : t('docs.brand.actions.copy-failed'))
}
</script>

<template>
  <div class="bk-basics">
    <!-- A cell has the entrance animation, so the transition of the entrance does not replace the hover transition of its card. -->
    <div class="bk-basics__cell is-name bk-reveal">
      <div class="bk-card">
        <p class="bk-card__label bk-mono">
          {{ t('docs.brand.basics.name') }}
        </p>
        <ul class="bk-names">
          <li v-for="name of names" :key="name.value" class="bk-names__row">
            <span class="bk-names__role">{{ t(`docs.brand.basics.${name.role}`) }}</span>
            <button type="button" class="bk-names__value" @click="copy(name.value)">
              <span class="bk-names__badge is-do" aria-hidden="true"><span class="i-lucide:check" /></span>
              <span class="bk-display">{{ name.value }}</span>
              <span class="bk-names__copy i-lucide:copy" aria-hidden="true" />
            </button>
          </li>
          <li class="bk-names__row">
            <span class="bk-names__role">{{ t('docs.brand.usage.dont') }}</span>
            <span class="bk-names__wrong">
              <span v-for="name of wrongNames" :key="name" class="bk-names__wrong-item">
                <span class="bk-names__badge is-dont" aria-hidden="true"><span class="i-lucide:x" /></span>
                <s class="bk-display">{{ name }}</s>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="bk-basics__cell is-wide is-credit bk-reveal">
      <button type="button" class="bk-card is-button" @click="copy(CREDIT_LINE)">
        <span class="bk-card__label bk-mono">
          {{ t('docs.brand.basics.credit') }}
          <span class="i-lucide:copy" aria-hidden="true" />
        </span>
        <!-- Each holder stays on one line, so the line can break only after "×". -->
        <span class="bk-credit bk-display"><span class="bk-credit__holder">© {{ CREDIT_HOLDERS[0] }} ×</span>{{ ' ' }}<span class="bk-credit__holder">{{ CREDIT_HOLDERS[1] }}</span></span>
      </button>
    </div>

    <div class="bk-basics__cell is-wide bk-reveal">
      <BrandColorSwatch :hex="MARK_PINK" />
    </div>

    <div v-for="font of fonts" :key="font.name" class="bk-basics__cell bk-reveal">
      <a
        :href="font.url"
        target="_blank"
        rel="noopener noreferrer"
        class="bk-font"
        :style="{ '--font': font.family }"
        :aria-label="`${font.name}, ${t('docs.brand.typography.get')}`"
        :title="t('docs.brand.typography.get')"
      >
        <span class="bk-font__glyph" aria-hidden="true">Aa</span>
        <span class="bk-font__meta">
          <span class="bk-font__role bk-mono">{{ t(`docs.brand.typography.${font.role}`) }}</span>
          <span class="bk-font__name">{{ font.name }}</span>
        </span>
        <span class="bk-font__arrow i-lucide:arrow-up-right" aria-hidden="true" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.bk-basics {
  display: grid;
  gap: 1rem;
}

/* The card fills the cell, so all cards of a row have the same height. */
.bk-basics__cell {
  display: grid;
  min-width: 0;
}

@media (min-width: 768px) {
  .bk-basics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bk-basics__cell.is-name,
  .bk-basics__cell.is-wide {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1024px) {
  .bk-basics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .bk-basics__cell.is-wide {
    grid-column: auto;
  }

  .bk-basics__cell.is-name {
    grid-column: span 2;
  }
}

.bk-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  min-width: 0;
  padding: 1.1rem 1.2rem 1.3rem;
  border: 1px solid var(--bk-line);
  border-radius: var(--bk-radius);
  text-align: left;
}

.bk-card.is-button {
  transition:
    border-color 0.3s ease,
    transform 0.5s var(--bk-ease-out);
}

@media (hover: hover) {
  .bk-card.is-button:hover {
    border-color: var(--bk-pink);
  }
}

.bk-card.is-button:active {
  transform: scale(0.99);
}

.bk-card.is-button:focus-visible {
  outline: 2px solid var(--bk-pink);
  outline-offset: 2px;
}

.bk-card__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
}

.bk-names {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* The role is above the name on small screens, and in its own column on all other screens. */
.bk-names__row {
  display: grid;
  gap: 0.25rem;
  align-items: center;
  padding-block: 0.5rem;
  border-top: 1px solid var(--bk-line);
}

.bk-names__row:last-child {
  padding-bottom: 0;
}

@media (min-width: 480px) {
  .bk-names__row {
    grid-template-columns: 6rem minmax(0, 1fr);
    gap: 0.75rem;
  }
}

.bk-names__role {
  color: hsl(var(--muted-foreground));
  font-size: 0.8125rem;
}

/* The whole row copies the name. */
.bk-names__value {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  min-width: 0;
  font-size: clamp(1.5rem, 2.6vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  text-align: left;
  transition:
    color 0.2s ease,
    transform 0.3s var(--bk-ease-out);
}

.bk-names__value:active {
  transform: scale(0.99);
}

.bk-names__value:focus-visible {
  outline: 2px solid var(--bk-pink);
  outline-offset: 2px;
}

.bk-names__copy {
  flex: none;
  margin-left: auto;
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

@media (hover: hover) {
  .bk-names__copy {
    opacity: 0.35;
  }

  .bk-names__value:hover {
    color: var(--bk-pink-ink);
  }

  .bk-names__value:hover .bk-names__copy {
    opacity: 1;
  }
}

.bk-names__badge {
  display: grid;
  flex: none;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  color: #fff;
  font-size: 0.875rem;
}

.bk-names__badge.is-do { background: #3aa76d; }
.bk-names__badge.is-dont { background: #e5484d; }

.bk-names__wrong {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
}

.bk-names__wrong-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: hsl(var(--muted-foreground));
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  cursor: not-allowed;
}

.bk-names__wrong-item s {
  text-decoration-color: #e5484d;
  text-decoration-thickness: 2px;
}

/*
 * The credit line stays on one line in its cell, also in the narrow cell of three columns. On one line, it is 11.96 em wide,
 * and the card has 38.4 px of padding. With a margin of 4 %, the font size is (cell width - 38.4 px) / 12.5. Below the
 * smallest size, the line breaks after "×".
 */
.bk-basics__cell.is-credit {
  container-type: inline-size;
}

.bk-credit {
  font-size: clamp(1.125rem, calc(8cqw - 3.1px), 2.25rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.bk-credit__holder {
  white-space: nowrap;
}

/* A type card links to the font. Hover makes the variable font bolder. */
.bk-font {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  min-height: 15rem;
  padding: 1.1rem 1.2rem;
  border: 1px solid var(--bk-line);
  border-radius: var(--bk-radius);
  color: hsl(var(--foreground));
  transition: border-color 0.3s ease;
}

.bk-font__glyph {
  font-family: var(--font);
  font-size: clamp(4.5rem, 8vw, 6.5rem);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.03em;
  transition: font-weight 0.5s var(--bk-ease-out);
}

.bk-font__meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.bk-font__role {
  color: var(--bk-pink-ink);
  font-size: 0.75rem;
}

.bk-font__name {
  font-family: var(--font);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.bk-font__arrow {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

@media (hover: hover) {
  .bk-font:hover {
    border-color: var(--bk-pink);
  }

  .bk-font:hover .bk-font__glyph {
    font-weight: 700;
  }

  .bk-font:hover .bk-font__arrow {
    opacity: 1;
  }
}

/* One card per row: the sample on the left and the name on the right, so the card is not taller than it needs to be. */
@media (max-width: 767px) {
  .bk-font {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1.25rem;
    min-height: 0;
  }

  /* The samples of the two fonts have different widths. A fixed width gives the names of both cards the same left edge. */
  .bk-font__glyph {
    flex: none;
    width: 4.75rem;
    font-size: 3.5rem;
  }

  .bk-font__name {
    font-size: 1.25rem;
  }
}

.bk-font:focus-visible {
  outline: 2px solid var(--bk-pink);
  outline-offset: 2px;
}
</style>
